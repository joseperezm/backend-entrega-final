# Documentación Proyecto Final Coderhouse

## Índice

1. [Introducción](#introducción)
2. [Descripción del Proyecto](#descripción-del-proyecto)
3. [Tecnologías Utilizadas](#tecnologías-utilizadas)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Estructura del Proyecto](#estructura-del-proyecto)
6. [Endpoints y Rutas](#endpoints-y-rutas)
   - [Endpoints de Productos](#endpoints-de-productos)
   - [Endpoints de Carritos](#endpoints-de-carritos)
   - [Endpoints de Usuarios](#endpoints-de-usuarios)
7. [Roles y Permisos](#roles-y-permisos)
8. [Funcionalidades Implementadas](#funcionalidades-implementadas)
   - [Agregar Productos](#agregar-productos)
   - [Eliminar Productos](#eliminar-productos)
   - [Gestión de Carritos](#gestión-de-carritos)
   - [Proceso de Compra](#proceso-de-compra)
   - [Gestión de Usuarios](#gestión-de-usuarios)
9. [Cambios y Mejoras Realizadas](#cambios-y-mejoras-realizadas)
    - [Modificaciones en el Método GET /](#modificaciones-en-el-método-get-)
    - [Nuevos Endpoints en Router de Carts](#nuevos-endpoints-en-router-de-carts)
    - [Vistas en Router de Views](#vistas-en-router-de-views)
10. [URL de Despliegue](#url-de-despliegue)

## Introducción

Este documento proporciona una visión general detallada del proyecto de ecommerce desarrollado durante el curso de backend en la academia online coderhouse.com. Abarca la descripción del proyecto, las tecnologías utilizadas, instrucciones de instalación y configuración, estructura del proyecto, endpoints y rutas, roles y permisos, funcionalidades implementadas, pruebas automatizadas, cambios y mejoras realizadas, así como el despliegue final del proyecto.

## Descripción del Proyecto

El proyecto de ecommerce es una aplicación web desarrollada para facilitar la compra y venta de productos en línea. Incluye funcionalidades clave como gestión de productos, carritos de compra, roles de usuario, autenticación y autorización, así como un flujo completo de compra. El objetivo principal es proporcionar una experiencia de usuario completa y profesional en el ámbito del comercio electrónico.

## Tecnologías Utilizadas

El proyecto utiliza las siguientes tecnologías:

- **Backend**:
  - Node.js
  - Express.js
  - Mongoose (para interactuar con MongoDB)
  - Passport.js (para autenticación)
  - Socket.io (para comunicación en tiempo real)
  - Nodemailer (para envío de correos)
  - Winston (para logging)

- **Base de Datos**:

  - MongoDB

- **Frontend**:

  - Handlebars (como motor de plantillas)

- **Otros**:

  - Docker (para contenerización y despliegue)
  - Swagger (para documentación de API)
  - GitHub (para control de versiones)

## Instalación y Configuración

### Prerrequisitos

- Node.js y npm instalados
- Cuenta atlas para MongoDB

### Pasos para la Instalación

1. Clonar el repositorio:

   ```sh
   git clone https://github.com/joseperezm/backend-entrega-final.git
   cd backend-entrega-final
   ```

2. Instalar las dependencias:

   ```sh
   npm install
   ```

3. Configurar las variables de entorno:

   Crear un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```env
   APP_PORT=Ingrese el puerto donde se levantará el servidor
    MONGODB_URI=Ingrese su string de conexión a su base de datos en MongoDB
    SESSION_SECRET=Ingrese su código de session
    ADMIN_EMAIL=Ingrese su email de administrador
    ADMIN_PASSWORD=Ingrese su contraseña de administrador
    GITHUB_CLIENT_ID=Ingrese su ID Client de Github
    GITHUB_CLIENT_SECRET=Ingrese su código Client Secret provisto por Github
    GITHUB_CALLBACK_URL=Ingrese su Callback URL declarado en Github
    GOOGLE_CLIENT_ID=Ingrese su ID Client de Google
    GOOGLE_CLIENT_SECRET=Ingrese su código Client Secret provisto por Google
    GOOGLE_CALLBACK_URL=Ingrese su Callback URL declarado en Google
    EMAIL_USER=dirección GMail backend nodemailer 
    EMAIL_PASS=clave aplicación GMail
    TEST_USER_EMAIL=dirección email tester
    TEST_USER_PASSWORD=clave tester
   ```

4. Iniciar la aplicación:

   ```sh
   npm start
   ```

### Ejecución en Modo de Desarrollo

Para ejecutar la aplicación en modo de desarrollo con nodemon:

```sh
npm run dev
```

## Estructura del proyecto

📦src

 ┣ 📂config

 ┃ ┣ 📜config.js

 ┃ ┣ 📜logger.js

 ┃ ┣ 📜passport.config.js

 ┃ ┗ 📜swagger.js

 ┣ 📂controllers

 ┃ ┣ 📜authController.js

 ┃ ┣ 📜authViewController.js

 ┃ ┣ 📜cartsController.js

 ┃ ┣ 📜cartsViewController.js

 ┃ ┣ 📜chatViewController.js

 ┃ ┣ 📜errorController.js

 ┃ ┣ 📜productsController.js

 ┃ ┣ 📜productsViewController.js

 ┃ ┣ 📜realTimeProductsViewController.js

 ┃ ┗ 📜userController.js

 ┣ 📂dao

 ┃ ┣ 📂fs

 ┃ ┃ ┣ 📜cartManager-fs.js

 ┃ ┃ ┣ 📜carts.json

 ┃ ┃ ┣ 📜productManager-fs.js

 ┃ ┃ ┗ 📜products.json

 ┃ ┣ 📂models

 ┃ ┃ ┣ 📜carts-mongoose.js

 ┃ ┃ ┣ 📜messages-mongoose.js

 ┃ ┃ ┣ 📜products-mongoose.js

 ┃ ┃ ┣ 📜ticket-mongoose.js

 ┃ ┃ ┣ 📜token-mongoose.js

 ┃ ┃ ┗ 📜user-mongoose.js

 ┣ 📂docs

 ┃ ┣ 📂carts

 ┃ ┃ ┗ 📜carts.yaml

 ┃ ┣ 📂debug

 ┃ ┃ ┗ 📜debug.yaml

 ┃ ┗ 📂products

 ┃ ┃ ┗ 📜products.yaml

 ┣ 📂dto

 ┃ ┗ 📜userDto.js

 ┣ 📂logs

 ┃ ┗ 📜errors.log

 ┣ 📂middleware

 ┃ ┣ 📜auth.js

 ┃ ┣ 📜authApi.js

 ┃ ┣ 📜authorize.js

 ┃ ┣ 📜authorizeApi.js

 ┃ ┣ 📜errorHandler.js

 ┃ ┣ 📜loggedIn.js

 ┃ ┣ 📜loggedInApi.js

 ┃ ┗ 📜multer.js

 ┣ 📂public

 ┃ ┣ 📂css

 ┃ ┃ ┗ 📜style.css

 ┃ ┣ 📂img

 ┃ ┃ ┣ 📜1.webp

 ┃ ┃ ┣ 📜2.webp

 ┃ ┃ ┗ 📜logo.png

 ┃ ┣ 📂js

 ┃ ┃ ┣ 📜addProduct.js

 ┃ ┃ ┣ 📜chat.js

 ┃ ┃ ┣ 📜deleteCart.js

 ┃ ┃ ┣ 📜deleteProduct.js

 ┃ ┃ ┣ 📜emptyCart.js

 ┃ ┃ ┣ 📜finalizePurchase.js

 ┃ ┃ ┣ 📜hideError.js

 ┃ ┃ ┣ 📜realTimeProducts.js

 ┃ ┃ ┣ 📜validate.js

 ┃ ┃ ┗ 📜year.js

 ┃ ┣ 📂uploads

 ┃ ┃ ┣ 📂products

 ┃ ┃ ┣ 📂profiles

 ┃ ┃ ┗ 📜placeholder.jpg

 ┣ 📂repository

 ┃ ┣ 📜cartRepository.js

 ┃ ┗ 📜productRepository.js

 ┣ 📂routes

 ┃ ┣ 📜carts.router.js

 ┃ ┣ 📜debug.router.js

 ┃ ┣ 📜products.router.js

 ┃ ┣ 📜sessions.router.js

 ┃ ┣ 📜users.router.js

 ┃ ┗ 📜views.router.js

 ┣ 📂services

 ┃ ┣ 📜cartService.js

 ┃ ┗ 📜productService.js

 ┣ 📂uploads

 ┃ ┣ 📂documents

 ┣ 📂utils

 ┃ ┣ 📜commander.js

 ┃ ┣ 📜errorCodes.js

 ┃ ┣ 📜hashBcrypt.js

 ┃ ┗ 📜mockData.js

 ┣ 📂views

 ┃ ┣ 📂layouts

 ┃ ┃ ┗ 📜main.handlebars

 ┃ ┣ 📜cart.handlebars

 ┃ ┣ 📜carts.handlebars

 ┃ ┣ 📜chat.handlebars

 ┃ ┣ 📜error.handlebars

 ┃ ┣ 📜forgot-password.handlebars

 ┃ ┣ 📜index.handlebars

 ┃ ┣ 📜login.handlebars

 ┃ ┣ 📜mockProducts.handlebars

 ┃ ┣ 📜products.handlebars

 ┃ ┣ 📜profile.handlebars

 ┃ ┣ 📜purchase.handlebars

 ┃ ┣ 📜realtimeproducts.handlebars

 ┃ ┣ 📜register.handlebars

 ┃ ┣ 📜reset-password.handlebars

 ┃ ┗ 📜users.handlebars

 ┣ 📜app.js

 ┗ 📜database.js

## Endpoints y Rutas

### Endpoints de Productos

1. **Listar todos los productos**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/products`
   - **Descripción**: Devuelve una lista de todos los productos.

2. **Obtener un producto por ID**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/products/:id` (Reemplaza `:id` con un ID existente)
   - **Descripción**: Devuelve el producto con el ID especificado.

3. **Agregar un nuevo producto**
   - **Método**: `POST`
   - **URL**: `http://localhost:8080/api/products`
   - **Cuerpo de la solicitud**: JSON con todos los campos requeridos.
   - **Descripción**: Agrega un nuevo producto.
   - **Consideraciones de seguridad**: No permite crear productos repetidos por código.

4. **Actualizar un producto por ID**
   - **Método**: `PUT`
   - **URL**: `http://localhost:8080/api/products/:id` (Reemplaza `:id` con un ID existente)
   - **Cuerpo de la solicitud**: JSON con los campos que deseas actualizar.
   - **Descripción**: Actualiza el producto con el ID especificado.

5. **Eliminar un producto por ID**
   - **Método**: `DELETE`
   - **URL**: `http://localhost:8080/api/products/:id` (Reemplaza `:id` con un ID existente)
   - **Descripción**: Elimina el producto con el ID especificado.

### Endpoints de Carritos

1. **Crear un nuevo carrito**
   - **Método**: `POST`
   - **URL**: `http://localhost:8080/api/carts`
   - **Descripción**: Crea un nuevo carrito.

2. **Listar productos en un carrito por ID de carrito**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/carts/:cid` (Reemplaza `:cid` con un ID de carrito existente)
   - **Descripción**: Devuelve los productos en el carrito con el ID de carrito especificado.

3. **Agregar un producto a un carrito**
   - **Método**: `POST`
   - **URL**: `http://localhost:8080/api/carts/:cid/product/:pid` (Reemplaza `:cid` con un ID de carrito y `:pid` con un ID de producto)
   - **Descripción**: Agrega el producto al carrito especificado y maneja correctamente la lógica para la cantidad de productos.
   - **Consideraciones de seguridad**: No permite agregar productos inexistentes al carrito.

4. **Actualizar el carrito con un arreglo de productos**
   - **Método**: `PUT`
   - **URL**: `http://localhost:8080/api/carts/:cid`
   - **Cuerpo de la solicitud**: JSON con un arreglo de productos.
   - **Descripción**: Actualiza el carrito con un arreglo de productos.

5. **Actualizar la cantidad de un producto específico en el carrito**
   - **Método**: `PUT`
   - **URL**: `http://localhost:8080/api/carts/:cid/products/:pid` (Reemplaza `:cid` con un ID de carrito y `:pid` con un ID de producto)
   - **Cuerpo de la solicitud**: JSON con la nueva cantidad.
   - **Descripción**: Actualiza la cantidad de un producto específico en el carrito.

6. **Eliminar un producto de un carrito**
   - **Método**: `DELETE`
   - **URL**: `http://localhost:8080/api/carts/:cid/product/:pid` (Reemplaza `:cid` con un ID de carrito y `:pid` con un ID de producto)
   - **Descripción**: Elimina el producto del carrito especificado.

7. **Eliminar un carrito por ID**
   - **Método**: `DELETE`
   - **URL**: `http://localhost:8080/api/carts/:cid` (Reemplaza `:cid` con un ID de carrito existente)
   - **Descripción**: Elimina el carrito con el ID especificado.

8. **Finalizar la compra de un carrito**
   - **Método**: `POST`
   - **URL**: `http://localhost:8080/api/carts/:cid/purchase` (Reemplaza `:cid` con un ID de carrito existente)
   - **Descripción**: Finaliza el proceso de compra de dicho carrito.
   - **Consideraciones**: La compra debe corroborar el stock del producto al momento de finalizarse. Si el producto tiene suficiente stock, se resta del stock del producto. Si no tiene suficiente stock, el producto no se agrega al proceso de compra.

### Endpoints de Usuarios

1. **Obtener todos los usuarios**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/users`
   - **Descripción**: Devuelve los datos principales de todos los usuarios como nombre, correo y tipo de cuenta (rol).

2. **Eliminar usuarios inactivos**
   - **Método**: `DELETE`
   - **URL**: `http://localhost:8080/api/users`
   - **Descripción**: Elimina todos los usuarios que no hayan tenido conexión en los últimos 2 días. (Para pruebas, se puede configurar para los últimos 30 minutos).
   - **Consideraciones**: Se envía un correo indicando al usuario que su cuenta ha sido eliminada por inactividad.

3. **Registro de usuario**
   - **Método**: `POST`
   - **URL**: `http://localhost:8080/api/sessions/register`
   - **Descripción**: Registra un nuevo usuario.

4. **Inicio de sesión de usuario**
   - **Método**: `POST`
   - **URL**: `http://localhost:8080/api/sessions/login`
   - **Descripción**: Inicia sesión con un usuario registrado.

5. **Cerrar sesión de usuario**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/sessions/logout`
   - **Descripción**: Cierra la sesión del usuario.

6. **Autenticación con GitHub**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/sessions/auth/github`
   - **Descripción**: Redirige al usuario para autenticarse con GitHub.

7. **Callback de autenticación con GitHub**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/sessions/auth/github/callback`
   - **Descripción**: Maneja el callback de autenticación con GitHub.

8. **Autenticación con Google**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/sessions/auth/google`
   - **Descripción**: Redirige al usuario para autenticarse con Google.

9. **Callback de autenticación con Google**
   - **Método**: `GET`
   - **URL**: `http://localhost:8080/api/sessions/auth/google/callback`
   - **Descripción**: Maneja el callback de autenticación con Google.

10. **Obtener sesión actual**
    - **Método**: `GET`
    - **URL**: `http://localhost:8080/api/sessions/current`
    - **Descripción**: Devuelve la información de la sesión actual del usuario autenticado.

## Roles y Permisos

El sistema de roles y permisos es esencial para la seguridad y funcionalidad del proyecto de ecommerce. A continuación se describen los roles implementados y los permisos asociados a cada uno:

### Roles

1. **Administrador**
   - Tiene control total sobre la aplicación.
   - Permisos:
     - Crear, actualizar y eliminar productos.
     - Ver y gestionar todos los usuarios.
     - Eliminar carritos y productos de cualquier usuario.
     - Acceder a todas las vistas de administración.
     - Gestionar roles de usuario.

2. **Usuario Premium**
   - Usuarios que han proporcionado documentación adicional y han sido verificados.
   - Permisos:
     - Crear productos.
     - Ver y gestionar sus propios productos.
     - Eliminar sus propios productos.
     - Acceder a funcionalidades premium.
     - Realizar compras y gestionar su propio carrito.

3. **Usuario Estándar**
   - Usuarios registrados con permisos básicos.
   - Permisos:
     - Ver productos.
     - Agregar productos a su carrito.
     - Realizar compras.
     - Enviar mensajes al chat.
     - Acceder a sus propios datos de perfil.

### Implementación de Roles y Permisos

Para implementar los roles y permisos, se utiliza un middleware de autorización que verifica el rol del usuario antes de permitir el acceso a ciertas rutas o funcionalidades.

## Funcionalidades Implementadas

### Agregar Productos

- **Descripción**: Permite a los usuarios con los roles adecuados (Administrador y Usuario Premium) agregar nuevos productos a la plataforma.
- **Endpoint**: `POST /api/products`
- **Cuerpo de la Solicitud**:

  ```json
  {
    "title": "Nombre del producto",
    "description": "Descripción del producto",
    "price": 100.00,
    "thumbnail": "url_de_imagen.jpg",
    "code": "codigo_unico",
    "stock": 50,
    "category": "Categoría del producto"
  }
  ```

- **Consideraciones de Seguridad**:
  - No permite agregar productos con códigos duplicados.

### Eliminar Productos

- **Descripción**: Permite a los usuarios con los roles adecuados (Administrador) eliminar productos de la plataforma.
- **Endpoint**: `DELETE /api/products/:id`
- **Parámetros**: `:id` - ID del producto a eliminar
- **Consideraciones de Seguridad**:
  - Solo los administradores pueden eliminar cualquier producto.
  - Los usuarios Premium pueden eliminar solo sus propios productos.
  - Si el producto pertenece a un usuario Premium, se envía un correo notificando la eliminación.

### Gestión de Carritos

- **Descripción**: Permite a los usuarios gestionar sus carritos de compra.
- **Endpoints**:
  - **Crear un nuevo carrito**: `POST /api/carts`
  - **Agregar un producto a un carrito**: `POST /api/carts/:cid/product/:pid`
    - Parámetros: `:cid` - ID del carrito, `:pid` - ID del producto
  - **Actualizar la cantidad de un producto en el carrito**: `PUT /api/carts/:cid/products/:pid`
    - Parámetros: `:cid` - ID del carrito, `:pid` - ID del producto
    - Cuerpo de la Solicitud:

      ```json
      {
        "quantity": 10
      }
      ```

  - **Eliminar un producto del carrito**: `DELETE /api/carts/:cid/product/:pid`
    - Parámetros: `:cid` - ID del carrito, `:pid` - ID del producto
  - **Eliminar todos los productos del carrito**: `DELETE /api/carts/:cid`
    - Parámetros: `:cid` - ID del carrito

### Proceso de Compra

- **Descripción**: Permite a los usuarios finalizar la compra de los productos en su carrito.
- **Endpoint**: `POST /api/carts/:cid/purchase`
- **Parámetros**: `:cid` - ID del carrito
- **Consideraciones**:
  - Verifica el stock de cada producto al momento de la compra.
  - Si un producto no tiene suficiente stock, no se procesa esa parte de la compra.
  - Genera un ticket de compra con los detalles de la transacción.
  - Actualiza el carrito para contener solo los productos que no pudieron ser comprados por falta de stock.

### Gestión de Usuarios

- **Descripción**: Permite a los administradores y usuarios gestionar información de usuarios.
- **Endpoints**:
  - **Obtener todos los usuarios**: `GET /api/users`
  - **Eliminar usuarios inactivos**: `DELETE /api/users`
  - **Registro de usuario**: `POST /api/sessions/register`
  - **Inicio de sesión de usuario**: `POST /api/sessions/login`
  - **Cerrar sesión de usuario**: `GET /api/sessions/logout`
  - **Autenticación con GitHub**: `GET /api/sessions/auth/github`
  - **Callback de autenticación con GitHub**: `GET /api/sessions/auth/github/callback`
  - **Autenticación con Google**: `GET /api/sessions/auth/google`
  - **Callback de autenticación con Google**: `GET /api/sessions/auth/google/callback`
  - **Obtener sesión actual**: `GET /api/sessions/current`

## Cambios y Mejoras Realizadas

### Modificaciones en el Método GET /

- **Objetivo**: Modificar el método `GET /` para soportar los siguientes parámetros opcionales:
  - `limit`: Número máximo de elementos a devolver. Valor por defecto: 10.
  - `page`: Número de página a consultar. Valor por defecto: 1.
  - `sort`: Ordenamiento ascendente (`asc`) o descendente (`desc`) por precio. Sin ordenamiento por defecto.
  - `query`: Filtro de búsqueda específico. Búsqueda general por defecto.

- **Respuesta esperada**: Objeto con el siguiente formato:

  ```json
  {
    "status": "success/error",
    "payload": "Resultado de los productos solicitados",
    "totalPages": "Total de páginas",
    "prevPage": "Página anterior",
    "nextPage": "Página siguiente",
    "page": "Página actual",
    "hasPrevPage": "Indica si existe una página previa",
    "hasNextPage": "Indica si existe una página siguiente",
    "prevLink": "Link a la página previa (null si hasPrevPage=false)",
    "nextLink": "Link a la página siguiente (null si hasNextPage=false)"
  }
  ```

- **Búsqueda por categoría o disponibilidad**: Permitir filtrar productos por categoría o disponibilidad y ordenar los resultados por precio de manera ascendente o descendente.

### Nuevos Endpoints en Router de Carts

- **DELETE api/carts/:cid/products/:pid**: Elimina el producto seleccionado del carrito.
- **PUT api/carts/:cid**: Actualiza el carrito con un arreglo de productos.
- **PUT api/carts/:cid/products/:pid**: Actualiza la cantidad de un producto específico en el carrito.
- **DELETE api/carts/:cid**: Elimina todos los productos del carrito.

**Nota**: Para el modelo de `Carts`, se asegura que el id de cada producto haga referencia al modelo de `Products` y se utiliza "populate" para desglosar productos asociados.

### Vistas en Router de Views

- **/products**: Muestra todos los productos con paginación. Opciones de visualización:
  1. Botón de "agregar al carrito" directamente en la lista de productos.

- **/carts/:cid (cartId)**: Vista para visualizar un carrito específico, listando solo los productos que pertenecen a dicho carrito.

## Tercera Pre Entrega

### Mejorando arquitectura del servidor

#### Objetivos generales

- Profesionalizar el servidor.

#### Objetivos específicos

- Aplicar una arquitectura profesional para nuestro servidor.
- Aplicar prácticas como patrones de diseño, mailing, variables de entorno, etc.

#### Entregables

##### Modificación de la capa de persistencia

- Modificar la capa de persistencia para aplicar los conceptos de Factory (opcional), DAO y DTO.

##### Implementación de Factory y DAO

- El DAO seleccionado (por un parámetro en línea de comandos como se hizo anteriormente) será devuelto por una Factory para que la capa de negocio opere con él. (Factory puede ser opcional).

##### Patrón Repository

- Implementar el patrón Repository para trabajar con el DAO en la lógica de negocio.

##### Modificación de la ruta /current

- Para evitar enviar información sensible, enviar un DTO del usuario solo con la información necesaria.

##### Middleware para sistema de autorización

- Realizar un middleware que pueda trabajar en conjunto con la estrategia "current" para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:
  - Solo el administrador puede crear, actualizar y eliminar productos.
  - Solo el usuario puede enviar mensajes al chat.
  - Solo el usuario puede agregar productos a su carrito.

##### Modelo Ticket

- Crear un modelo Ticket el cual contará con todas las formalizaciones de la compra. Este contará con los campos:
  - Id (autogenerado por mongo)
  - code: String debe autogenerarse y ser único
  - purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se formalizó la compra (básicamente es un created_at)
  - amount: Number, total de la compra.
  - purchaser: String, contendrá el correo del usuario asociado al carrito.

##### Ruta de compra en el router de carts

- Implementar, en el router de carts, la ruta `/:cid/purchase`, la cual permitirá finalizar el proceso de compra de dicho carrito.
  - La compra debe corroborar el stock del producto al momento de finalizarse.
  - Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces restarlo del stock del producto y continuar.
  - Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, entonces no agregar el producto al proceso de compra.

##### Servicio de Tickets

- Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra.
- En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse.
- Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener solo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.

## URL de Despliegue

La aplicación está desplegada en la siguiente URL:

[https://backend-entrega-final-4ppy.onrender.com](https://backend-entrega-final-4ppy.onrender.com)

Accede a esta URL para interactuar con la aplicación de ecommerce en su entorno de producción.
