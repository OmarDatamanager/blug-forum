try {
  const rateLimit = require('express-rate-limit');

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many login attempts, please try again after 15 minutes' },
    standardHeaders: true,
    legacyHeaders: false
  });

  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false
  });

  module.exports = { loginLimiter, generalLimiter };

} catch (error) {
  console.log('express-rate-limit not found, using simple limiter');

  const simpleLimiter = (req, res, next) => next();

  module.exports = {
    loginLimiter: simpleLimiter,
    generalLimiter: simpleLimiter
  };
}