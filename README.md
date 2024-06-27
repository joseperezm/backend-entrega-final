# Entrega Final: Backend de una aplicación ecommerce

## Deploy URL

[https://backend-entrega-final-4ppy.onrender.com](https://backend-entrega-final-4ppy.onrender.com)

## Rutas del router de /api/users

1. **GET /**: Obtener todos los usuarios. Este endpoint debe devolver los datos principales como nombre, correo y tipo de cuenta (rol).
2. **DELETE /**: Limpiar a todos los usuarios que no hayan tenido conexión en los últimos 2 días. (puedes hacer pruebas con los últimos 30 minutos, por ejemplo). Deberá enviarse un correo indicando al usuario que su cuenta ha sido eliminada por inactividad.

## Vista de Administración de Usuarios

- Crear una vista para visualizar, modificar el rol y eliminar un usuario. Esta vista será accesible únicamente para el administrador del ecommerce.

## Modificación de Endpoint para Eliminar Productos

- Modificar el endpoint que elimina productos para que, en caso de que el producto pertenezca a un usuario premium, se envíe un correo indicando que el producto fue eliminado.

## Finalización de Vistas para el Flujo Completo de Compra

- Finalizar las vistas pendientes para la realización del flujo completo de compra. No es necesario tener una estructura específica de vistas, sólo las necesarias para llevar a cabo el proceso de compra.
- No es necesario desarrollar vistas para módulos que no influyan en el proceso de compra (como vistas de usuarios premium para crear productos o vistas de panel de admin para actualizaciones de productos, etc).

## Despliegue del Aplicativo

- Realizar el despliegue del aplicativo en la plataforma de tu elección (preferentemente Railway.app, pues es la abarcada en el curso) y corroborar que se puede llevar a cabo un proceso de compra completo.

## Objetivos Específicos

- Conseguir una experiencia de compra completa.
- Cerrar detalles administrativos con los roles.

## Observaciones

Para la autorización de usuario premium se deben subir tres documentos acreditando cuenta, id y domicilio. para que esto sea aceptado cada uno de los documentos deben llevar como nombre id, cuenta y domicilio.

- id.pdf
- domicilio.pdf
- cuenta.pdf
