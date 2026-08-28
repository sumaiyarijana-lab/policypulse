const { validationResult, check } = require('express-validator');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Common sanitization rules
const loginRules = [
  check('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').trim().escape()
];

const registerRules = [
  check('name').notEmpty().withMessage('Name is required').trim().escape(),
  check('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long').trim().escape(),
  check('phone').optional().isMobilePhone().withMessage('Invalid phone number').trim().escape()
];

module.exports = {
  validateRequest,
  loginRules,
  registerRules
};
