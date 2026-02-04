const express = require('express');
const { getProfile } = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const { auditMiddleware } = require('../middleware/audit');

const router = express.Router();

router.get('/profile', authenticate, auditMiddleware('PROTECTED_ACCESS'), rateLimiter(100, 15), getProfile);

module.exports = router;
