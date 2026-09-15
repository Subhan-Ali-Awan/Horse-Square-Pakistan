const rateLimit = require('express-rate-limit');

/**
 * Dr. Max Chat Rate Limiter
 * Protects the public /api/vet/chat endpoint from abuse.
 * 20 requests per IP per 15 minutes.
 */
const drMaxRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                  // max 20 requests per window
  standardHeaders: true,    // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. You have reached the Dr. Max consultation limit for this period. Please wait 15 minutes before sending another message.',
  },
  handler: (req, res, next, options) => {
    console.warn(`[RATE LIMIT] Dr. Max chat rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json(options.message);
  },
});

module.exports = drMaxRateLimit;
