const rateLimit = require('express-rate-limit');

/**
 * Dr. Max Chat Rate Limiter
 * Protects the public /api/vet/chat endpoint from abuse.
 */
const drMaxRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 500, // relaxed for active testing
  standardHeaders: true,    // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiter on localhost in development
    const ip = req.ip || req.connection?.remoteAddress || '';
    return process.env.NODE_ENV !== 'production' && (ip.includes('127.0.0.1') || ip.includes('::1') || ip.includes('localhost'));
  },
  message: {
    success: false,
    error: 'Too many requests. You have reached the Dr. Max consultation limit for this period. Please wait a few minutes before sending another message.',
  },
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Dr. Max chat rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

module.exports = drMaxRateLimit;

