const express = require('express');
const router = express.Router();
const { trackVisit, getAnalytics } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/hit', trackVisit);
router.get('/metrics', protect, authorize('admin', 'editor'), getAnalytics);

module.exports = router;
