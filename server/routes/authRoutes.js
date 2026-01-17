const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authorization = require('../middleware/authorization');

// Register
router.post('/signup', authController.register);

// Login
router.post('/login', authController.login);

// Verify (Protected)
router.get('/verify', authorization, authController.verify);

module.exports = router;
