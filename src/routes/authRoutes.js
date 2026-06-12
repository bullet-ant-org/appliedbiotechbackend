const express = require('express');
const router = express.Router();
const { login, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile/update', protect, updateProfile);
router.put('/profile/password', protect, changePassword);

module.exports = router;
