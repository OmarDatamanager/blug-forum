const express = require('express');
const authController = require('../controllers/authController');
const { loginLimiter } = require('../middleware/rateLimit');
const { validateUserRegistration } = require('../middleware/validation');

const router = express.Router();

router.post('/register', validateUserRegistration, authController.register);
router.post('/login', loginLimiter, authController.login);

module.exports = router;