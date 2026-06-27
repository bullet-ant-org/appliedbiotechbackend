const express = require('express');
const router = express.Router();
const { createAccount, getAllAccounts, modifyRoleTier } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/create', protect, authorize('admin'), createAccount);
router.get('/', protect, authorize('admin'), getAllAccounts);
router.put('/:id/role-escalation', protect, authorize('admin'), modifyRoleTier);

module.exports = router;
