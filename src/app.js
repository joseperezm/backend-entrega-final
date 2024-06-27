const express = require('express');
const flash = require('express-flash');
const session = require('express-session');
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const nodemailer = require('nodemailer');
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const sessionsRouter = require('./routes/sessions.router.js');
const usersRouter = require('./routes/users.router.js');
const debugRouter = require('./routes/debug.router.js');
const initializePassport = require("./config/passport.config.js");
const config = require('./config/config.js');
const UserModel = require('./dao/models/user-mongoose.js');
const Product = require('./dao/models/products-mongoose.js');
const errorHandler = require('./middleware/errorHandler.js');
const errorCodes = require('./utils/errorCodes.js');
const logger = require('./config/logger.js');
const path = require('path');

const PORT = config.APP_PORT;
require("./database.js");

const app = express();

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.use(cookieParser());

const { swaggerUiExpress, specs } = require('./config/swagger.js');
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
    },
    pool: true,
    rateLimit: 1,
    maxConnections: 1,
    maxMessages: 10
});

const oneWeekLogin = 7 * 24 * 60 * 60;

app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: config.MONGODB_URI,
        ttl: oneWeekLogin
    }),
    cookie: {
        maxAge: oneWeekLogin * 1000
    }
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(async (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user.toObject();

        res.locals.role = req.user.role;

        const userWithCart = await UserModel.findById(req.user._id).populate('cart');
        if (userWithCart && userWithCart.cart) {
            res.locals.cartId = userWithCart.cart._id;
        }
    }
    if (req.session.user) {
        req.user = req.session.user;
        res.locals.user = req.session.user;
    }
    next();
});

app.use(express.static("./src/public"));

app.engine("handlebars", exphbs.engine({
    helpers: {
        multiply: function (a, b) {
            return (a * b).toFixed(2);
        },
        totalCart: function (products) {
            let total = 0;
            products.forEach(product => {
                total += product.quantity * product.productId.price;
            });
            return total.toFixed(2);
        },
        eq: function (arg1, arg2) {
            return arg1 === arg2;
        },
        or: function (arg1, arg2) {
            return arg1 || arg2;
        },
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    },
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
}));

app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use('/loggerTest', debugRouter);
app.use("/api", productsRouter);
app.use("/api", cartsRouter);
app.use("/", viewsRouter);

app.use('/api/sessions', sessionsRouter);
app.use('/api/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.code = 'NOT_FOUND';
    error.status = errorCodes.NOT_FOUND.statusCode;
    logger.warn(`Recurso no encontrado: ${req.originalUrl} - IP: ${req.ip} - Error: ${error.message}`);
    next(error);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    if (err.status === 404) {
        res.redirect(`/error?message=404`);
    } else {
        logger.error(`Error en el servidor - ${err.status || 500} - ${err.message} - ${req.originalUrl} - IP: ${req.ip}`);
        res.render('error', { error: err });
    }
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
    logger.debug(`Servidor escuchando en el puerto ${PORT}`);
});

module.exports = app;

//Se borra esto?
const ProductManagerFs = require("./dao/fs/productManager-fs")
const productManagerFs = new ProductManagerFs("./dao/fs/products.json");
//
const ProductRepositor = require("./repository/productRepository.js");
const productRepositor = new ProductRepositor();

const io = socket(server);

const Message = require('./dao/models/messages-mongoose.js');

io.on("connection", async (socket) => {
    logger.info(`Nuevo usuario conectado a socket ${socket.id}`);

    socket.emit("products", await productRepositor.getProducts());

    socket.on("deleteProduct", async ({ id, userId, userRole }) => {
        try {
            const product = await Product.findById(id).populate('owner');

            if (!product) {
                logger.info("Producto no encontrado");
                socket.emit("deleteError", { message: "Producto no encontrado" });
                return;
            }

            if (product.owner === null) {
                logger.warn(`Usuario premium intentó borrar el producto con ID: ${id} que no le pertenece. User ID: ${userId}, Product Owner: sin propietario válido.`);
                socket.emit("deleteError", { message: "No autorizado para borrar este producto" });
                return;
            }

            if (userRole === 'premium' && product.owner._id.toString() !== userId) {
                logger.warn(`Usuario premium intentó borrar el producto con ID: ${id} que no le pertenece. User ID: ${userId}, Product Owner: ${product.owner._id}`);
                socket.emit("deleteError", { message: "No autorizado para borrar este producto" });
                return;
            }

            const success = await Product.findByIdAndDelete(id);
            if (success) {
                if (product.owner.role === 'premium' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(product.owner.email)) {
                    const mailOptions = {
                        from: config.EMAIL_USER,
                        to: product.owner.email,
                        subject: 'Producto Eliminado',
                        text: `Hola ${product.owner.first_name},\n\nTu producto "${product.title}" ha sido eliminado.\n\nSaludos,\nEquipo de Soporte`
                    };
                    await transport.sendMail(mailOptions);
                    logger.info(`Correo enviado exitosamente a ${product.owner.first_name} ${product.owner.last_name} (${product.owner.email})`);
                }
                io.sockets.emit("products", await Product.find());
                logger.info('Producto eliminado correctamente');
            } else {
                logger.info("Producto no encontrado");
                socket.emit("deleteError", { message: "Producto no encontrado" });
            }
        } catch (error) {
            logger.error('Error al eliminar el producto:', error);
            socket.emit("deleteError", { message: "Error interno al eliminar el producto" });
        }
    });
    
    socket.on("addProduct", async (producto) => {
        await productRepositor.addProduct(producto);
        io.sockets.emit("products", await productRepositor.getProducts());
    });

    socket.on('user email provided', (email) => {
        logger.info(`Correo electrónico recibido: ${email}`);
        Message.find().then(messages => {
            socket.emit('load all messages', messages);
        });
    });

    socket.on('chat message', async (data) => {
        try {
            const message = new Message(data);
            await message.save();
            io.emit('chat message', data);
        } catch (error) {
            logger.error('Error guardando el mensaje', error);
        }
    });

    socket.on('disconnect', (reason) => {
        logger.info(`Usuario desconectado de socket ${socket.id}: ${reason}`);
    });
});