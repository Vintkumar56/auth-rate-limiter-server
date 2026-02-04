const express = require('express');
const { getAuditLogs } = require('../controllers/auditController');
const authenticate = require('../middleware/auth');
const authorizeRoles = require('../middleware/authorizeRoles');

const router = express.Router();

router.get('/audit-logs', authenticate, authorizeRoles('admin'), getAuditLogs);

module.exports = router;
