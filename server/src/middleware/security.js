const rateLimit = require('express-rate-limit');

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { message: 'Too many requests from this IP, please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 failed login/register attempts per hour
  message: { message: 'Too many authentication attempts, please try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Environment variable protection
const validateEnvVars = () => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  const missing = requiredVars.filter(envVar => !process.env[envVar]);
  if (missing.length > 0) {
    console.error(`❌ FATAL ERROR: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
};

// CAPTCHA protection middleware (mock verification for now)
const verifyCaptcha = (req, res, next) => {
  // In a real app, verify req.body.captchaToken with Google reCAPTCHA API
  const token = req.body.captchaToken;
  if (process.env.NODE_ENV === 'production' && !token) {
    return res.status(403).json({ message: 'CAPTCHA verification failed. Please try again.' });
  }
  next();
};

module.exports = {
  apiLimiter,
  authLimiter,
  validateEnvVars,
  verifyCaptcha
};
