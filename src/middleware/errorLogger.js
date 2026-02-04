const logger = require('../utils/logger');

const errorLogger = (err, req, res, next) => {
  logger.error('Request Error', {
    method: req.method,
    path: req.path,
    statusCode: err.statusCode || 500,
    error: err.message,
    stack: err.stack,
    userId: req.user?._id || null,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent')
  });
  
  next(err);
};

module.exports = errorLogger;
