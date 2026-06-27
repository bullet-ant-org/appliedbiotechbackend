const express = require('express');
const router = express.Router();
const { submitMessage, getMessages, updateMessageStatus, deleteMessage } = require('../controllers/messageController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public: submit a message from contact form
router.post('/', submitMessage);

// Admin/editor protected
router.get('/', protect, authorize('admin', 'editor'), getMessages);
router.put('/:id/status', protect, authorize('admin', 'editor'), updateMessageStatus);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteMessage);

module.exports = router;
