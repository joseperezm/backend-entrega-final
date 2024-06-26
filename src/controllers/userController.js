const UserModel = require('../dao/models/user-mongoose');
const logger = require('../config/logger');
const path = require('path');
const nodemailer = require('nodemailer');
const config = require('../config/config');

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

exports.deleteInactiveUsers = async (req, res) => {
  try {
      const now = new Date();
      const threshold = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      const inactiveUsers = await UserModel.find({ last_connection: { $lt: threshold } });

      const deletePromises = inactiveUsers.map(async user => {
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
              const mailOptions = {
                  from: config.EMAIL_USER,
                  to: user.email,
                  subject: 'Cuenta eliminada por inactividad',
                  text: `Hola ${user.first_name},\n\nTu cuenta ha sido eliminada debido a inactividad.\n\nSaludos,\nEquipo de Soporte`
              };
              await transport.sendMail(mailOptions);
          }
          return UserModel.findByIdAndDelete(user._id);
      });

      await Promise.all(deletePromises);

      res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados (cuando correspondía).' });
  } catch (error) {
      logger.error('Error al eliminar usuarios inactivos:', error);
      res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, 'first_name last_name email role last_connection');
    res.status(200).json(users);
  } catch (error) {
    logger.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await UserModel.findById(uid);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    if (user.role === 'premium') {
      user.role = 'user';
      await user.save();
      return res.status(200).json({ message: 'Rol de usuario revertido a user.' });
    } else {
      const requiredDocuments = ['id', 'domicilio', 'cuenta'];
      const uploadedDocuments = user.documents.map(doc => doc.name);

      const missingDocuments = requiredDocuments.filter(doc => !uploadedDocuments.includes(doc));

      if (missingDocuments.length > 0) {
        return res.status(400).json({ message: 'El usuario no ha subido todos los documentos necesarios.', missingDocuments });
      }

      user.role = 'premium';
      await user.save();

      res.status(200).json({ message: 'Rol de usuario actualizado a premium.' });
    }
  } catch (error) {
    console.error('Error al cambiar el rol del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor', error });
  }
};


  exports.uploadDocuments = async (req, res) => {
    try {
      const { uid } = req.params;
      const files = req.files;
  
      if (!files || files.length === 0) {
        return res.status(400).json({ message: 'No se han subido archivos.' });
      }
  
      const documents = files.map(file => {
        const baseName = path.basename(file.originalname, path.extname(file.originalname));
        const relativePath = file.path.replace(/^.*uploads\//, 'uploads/');
        return {
          name: baseName,
          reference: relativePath
        };
      });
  
      const user = await UserModel.findById(uid);
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
  
      user.documents.push(...documents);
      await user.save();
  
      res.status(200).json({ message: 'Documentos subidos exitosamente.', documents: user.documents });
    } catch (error) {
      console.error('Error al subir documentos:', error);
      res.status(500).json({ message: 'Error interno del servidor', error });
    }
  };