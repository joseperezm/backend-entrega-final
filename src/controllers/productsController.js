const nodemailer = require('nodemailer');
const config = require('../config/config');
const UserModel = require('../dao/models/user-mongoose');
const productService = require('../services/productService');
const Product = require('../dao/models/products-mongoose');
const { generateProductsApi } = require('../utils/mockData');
const errorCodes = require('../utils/errorCodes');
const logger = require("../config/logger");

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

exports.getProducts = async (req, res, next) => {
    const limit = req.query.limit === undefined ? 10 : parseInt(req.query.limit, 10);
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    try {
        const { products, totalPages } = await productService.getProducts({ limit, page, sort, query });
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevPage = hasPrevPage ? page - 1 : null;
        const nextPage = hasNextPage ? page + 1 : null;
        const baseUrl = '/api/products?';

        res.json({
            status: "success",
            products,
            totalPages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `${baseUrl}page=${prevPage}` : null,
            nextLink: hasNextPage ? `${baseUrl}page=${nextPage}` : null
        });
    } catch (error) {
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
        logger.error("Error interno", error);
    }
};

exports.getProductById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.pid);
        if (!product) {
            const error = new Error('Producto no encontrado');
            error.code = 'NOT_FOUND';
            res.status(404).json({ code: 'NOT_FOUND', message: 'Producto no encontrado' });
        } else {
            res.json(product);
        }
    } catch (error) {
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
        logger.error("Error interno", error);
    }
};

exports.addProduct = async (req, res, next) => {
    try {
        const { title, price, description, code, stock, category } = req.body;
        const fieldTypes = {
            title: 'String',
            price: 'Number',
            description: 'String',
            code: 'String',
            stock: 'Number',
            category: 'String'
        };

        const requiredFields = [];
        const missingFieldDetails = [];

        for (const [field, type] of Object.entries(fieldTypes)) {
            if (!req.body[field]) {
                requiredFields.push(field);
                missingFieldDetails.push(`${field}: ${type}`);
            }
        }

        if (requiredFields.length > 0) {
            logger.debug("Faltan campos requeridos con sus tipos:", missingFieldDetails.join(", "));
            return res.status(400).json({
                code: 'MISSING_FIELDS',
                message: 'Campos requeridos faltantes: ' + missingFieldDetails.join(", "),
                fields: requiredFields
            });
        }

        const ownerId = req.session.user.id;

        const newProduct = { title, price, description, code, stock, category, owner: ownerId };
        const product = await productService.addProduct(newProduct);
        res.status(201).json({ id: product._id, message: 'Producto agregado correctamente' });
    } catch (error) {
        next({ code: error.code || 'INTERNAL_SERVER_ERROR', original: error });
        logger.error("Error interno", error);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            logger.info("Producto no encontrado");
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Producto no encontrado' });
        } else {
            res.json({ message: 'Producto actualizado correctamente', product: updatedProduct });
        }
    } catch (error) {
        logger.error("Error interno", error);
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.pid;
        const userId = req.user.id;
        const userRole = req.user.role;

        const product = await Product.findById(productId).populate('owner');

        if (!product) {
            logger.info("Producto no encontrado");
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Producto no encontrado' });
        }

        if (userRole === 'premium' && product.owner._id.toString() !== userId.toString()) {
            logger.warn(`Usuario premium intentó borrar un producto que no le pertenece. User ID: ${userId}, Product Owner: ${product.owner._id}`);
            return res.status(403).json({ message: 'No autorizado para borrar este producto' });
        }

        const success = await productService.deleteProduct(productId);
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
            } else {
                logger.info(`No se envió el correo porque el usuario no es premium o el correo no es válido. Usuario: ${product.owner.first_name} ${product.owner.last_name}, Rol: ${product.owner.role}, Correo: ${product.owner.email}`);
            }
            res.status(200).json({ message: 'Producto eliminado correctamente' });
        } else {
            logger.info("Producto no encontrado");
            return res.status(404).json({ code: 'NOT_FOUND', message: 'Producto no encontrado' });
        }
    } catch (error) {
        next({ code: 'INTERNAL_SERVER_ERROR', original: error });
        logger.error("Error interno", error);
    }
};

exports.mockProducts = (req, res) => {
    const products = generateProductsApi();
    res.json(products);
};