const crypto = require('crypto');
const Token = require('../dao/models/token-mongoose');
const UserModel = require("../dao/models/user-mongoose");

exports.showLogin = (req, res) => {
    const messages = req.flash();
    res.render('login', { messages, user: req.session.user || null });
};

exports.showRegister = (req, res) => {
    const messages = req.flash();
    res.render('register', { messages, user: req.session.user || null });
};

exports.showProfile = (req, res) => {
    UserModel.findById(req.session.user.id)
      .then(user => {
        if (!user) {
          return res.status(404).send('Usuario no encontrado.');
        }
        res.render('profile', { user: user });
      })
      .catch(error => {
        console.error('Error al obtener el perfil del usuario:', error);
        res.status(500).send('Error interno del servidor');
      });
  };
  

exports.showForgotPassword = (req, res) => {
    const messages = req.flash();
    res.render('forgot-password', { messages, user: req.session.user || null });
};

exports.showResetPasswordForm = async (req, res) => {
    const { token } = req.params;
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    const resetToken = await Token.findOne({ token: hash });
    if (!resetToken) {
        req.flash('error', 'Token inválido o ha expirado.');
        return res.redirect('/forgot-password');
    }
    const messages = req.flash();
    res.render('reset-password', { token, messages, user: req.session.user || null  });
};