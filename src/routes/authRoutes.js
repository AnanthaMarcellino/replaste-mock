const express = require('express');
const router = express.Router();
const { AuthController, ImageController } = require('../controllers/authController');

// Auth routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/request-reset', AuthController.requestReset);
router.get('/validate-token/:token', AuthController.validateResetToken);
router.post('/reset/:token', AuthController.resetPassword);

// Prediction routes
router.post('/predict', 
  ImageController.uploadMiddleware,
  ImageController.savePrediction
);
router.get('/predictions/:userId', ImageController.getUserPredictions);

module.exports = router;