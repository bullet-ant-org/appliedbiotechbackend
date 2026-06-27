const express = require('express');
const router = express.Router();
const { login, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile/update', protect, upload.single('avatar'), updateProfile);
router.put('/profile/password', protect, changePassword);

module.exports = router;
