const AuditLog = require('../models/AuditLog');

const createAuditLog = async (userId, action, endpoint, method, metadata = {}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      endpoint,
      method,
      metadata
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
};

const auditMiddleware = (action) => {
  return async (req, res, next) => {
    if (req.user) {
      const originalSend = res.send;
      
      res.send = function(data) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setImmediate(async () => {
            await createAuditLog(
              req.user._id,
              action,
              req.path,
              req.method,
              {
                statusCode: res.statusCode,
                ip: req.ip,
                userAgent: req.get('User-Agent')
              }
            );
          });
        }
        originalSend.call(this, data);
      };
    }
    next();
  };
};

module.exports = {
  createAuditLog,
  auditMiddleware
};
