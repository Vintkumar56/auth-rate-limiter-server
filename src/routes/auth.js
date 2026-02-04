const express = require('express');
const { register, login, refreshToken } = require('../controllers/authController');
const { validate, registerSchema, loginSchema, refreshTokenSchema } = require('../utils/validation');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refreshToken);

module.exports = router;
