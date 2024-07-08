const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const redirectIfNotLoggedInApi = require('../middleware/auth.js');
const authorizeApi = require('../middleware/authorizeApi.js');
const upload = require('../middleware/multer');

router.delete('/', authorizeApi('admin'), redirectIfNotLoggedInApi, userController.deleteInactiveUsers);
router.delete('/:uid', authorizeApi('admin'), redirectIfNotLoggedInApi, userController.deleteUser);
router.get('/', authorizeApi('admin'), redirectIfNotLoggedInApi, userController.getAllUsers);
router.put('/premium/:uid', authorizeApi('admin'), redirectIfNotLoggedInApi, userController.changeUserRole);
router.post('/:uid/documents', upload.array('documents'), redirectIfNotLoggedInApi, userController.uploadDocuments);
router.post('/:uid/profile-image', upload.single('profile_image'), redirectIfNotLoggedInApi, userController.uploadProfileImage);

module.exports = router;
