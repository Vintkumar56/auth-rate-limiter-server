const express = require('express');
const { getDashboard } = require('../controllers/adminController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');
const rateLimiter = require('../middleware/rateLimiter');
const { auditMiddleware } = require('../middleware/audit');

const router = express.Router();

router.get('/dashboard', authenticate, authorizeRoles('admin'), auditMiddleware('ADMIN_ACCESS'), rateLimiter(500, 15), getDashboard);

module.exports = router;
