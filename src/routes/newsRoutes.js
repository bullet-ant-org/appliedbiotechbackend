const express = require('express');
const router = express.Router();
const { createNews, getNews, getNewsById, updateNews, deleteNewsArticle } = require('../controllers/newsController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getNews);
router.get('/:id', getNewsById);
router.post('/', protect, authorize('admin', 'editor'), upload.single('coverImage'), createNews);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('coverImage'), updateNews);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteNewsArticle);

module.exports = router;
