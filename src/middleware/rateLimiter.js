const redis = require('../config/redis');

const rateLimiter = (maxRequests, windowMinutes) => {
  return async (req, res, next) => {
    try {
      let key;
      let limit = maxRequests;
      
      if (req.user) {
        key = `rate:user:${req.user._id}`;
        if (req.user.role === 'admin') {
          limit = 500;
        } else {
          limit = 100;
        }
      } else {
        const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
        key = `rate:ip:${ip}`;
        limit = 50;
      }

      const current = await redis.incr(key);
      
      if (current === 1) {
        await redis.expire(key, windowMinutes * 60);
      }

      const ttl = await redis.ttl(key);
      
      res.set({
        'X-RateLimit-Limit': limit,
        'X-RateLimit-Remaining': Math.max(0, limit - current),
        'X-RateLimit-Reset': ttl > 0 ? Date.now() + (ttl * 1000) : null
      });

      if (current > limit) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests',
          retryAfter: ttl
        });
      }

      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      next();
    }
  };
};

module.exports = rateLimiter;
