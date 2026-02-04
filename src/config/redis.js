const Redis = require('ioredis');

let redis;

try {
  redis = new Redis(process.env.REDIS_URL, {
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: null,
  });

  redis.on('connect', () => {
    console.log('Redis connected successfully');
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err.message);
    console.log('Continuing without Redis for testing...');
  });
} catch (error) {
  console.error('Redis initialization error:', error.message);
  console.log('Using mock Redis for testing...');
  
  redis = {
    incr: async () => 1,
    expire: async () => 'OK',
    ttl: async () => 900,
    quit: async () => 'OK'
  };
}

module.exports = redis;
