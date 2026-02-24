const rateLimit = require('express-rate-limit');

// General API rate limiter (more permissive for development)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    success: false,
    error: 'Too Many Requests',
    message: 'Rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit each IP to 20 AI requests per hour
  message: {
    success: false,
    error: 'Too Many AI Requests',
    message: 'AI rate limit exceeded. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Create/Update rate limiter (more permissive for development)
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 create/update requests per minute
  message: {
    success: false,
    error: 'Too Many Create Requests',
    message: 'Create rate limit exceeded. Please wait before creating more items.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  aiLimiter,
  createLimiter
};
