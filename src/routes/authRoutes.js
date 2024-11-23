const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const ImageController = require('../controllers/authController');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/request-reset', AuthController.requestReset);
router.get('/validate-token/:token', AuthController.validateResetToken);
router.post('/reset/:token', AuthController.resetPassword);

router.post('/upload', 
  ImageController.uploadMiddleware, 
  ImageController.uploadImage
);

router.get('/my-images/:userId', ImageController.getUserImages);

module.exports = router;