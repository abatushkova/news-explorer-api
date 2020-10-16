const { JWT_SECRET = 'JWT_SECRET' } = process.env;
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});

module.exports = {
  JWT_SECRET,
  limiter,
};
