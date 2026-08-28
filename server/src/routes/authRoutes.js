const express = require('express');
const router = express.Router();
const {
  register,
  login,
  adminLogin,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  updateSettings,
  changePassword,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter, verifyCaptcha } = require('../middleware/security');
const { validateRequest, loginRules, registerRules } = require('../middleware/validate');

// Public routes
router.post('/register', authLimiter, verifyCaptcha, registerRules, validateRequest, register);
router.post('/login', authLimiter, verifyCaptcha, loginRules, validateRequest, login);
router.post('/admin/login', authLimiter, verifyCaptcha, loginRules, validateRequest, adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/settings', protect, updateSettings);
router.put('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
