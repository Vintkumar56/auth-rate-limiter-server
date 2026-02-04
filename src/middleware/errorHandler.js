const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let error = { ...err };
  error.message = err.message;

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: err.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      }
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const message = 'Validation Error';
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: {
        type: 'VALIDATION_ERROR',
        message,
        details: errors
      }
    });
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    return res.status(400).json({
      success: false,
      error: {
        type: 'DUPLICATE_ERROR',
        message
      }
    });
  }

  if (err.name === 'CastError') {
    const message = 'Invalid ID format';
    return res.status(400).json({
      success: false,
      error: {
        type: 'CAST_ERROR',
        message
      }
    });
  }

  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    return res.status(401).json({
      success: false,
      error: {
        type: 'JWT_ERROR',
        message
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    return res.status(401).json({
      success: false,
      error: {
        type: 'TOKEN_EXPIRED',
        message
      }
    });
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      type: error.type || 'INTERNAL_ERROR',
      message: error.message || 'Internal Server Error'
    }
  });
};

module.exports = errorHandler;
