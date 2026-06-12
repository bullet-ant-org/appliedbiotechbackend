const express = require('express');
const router = express.Router();
const { getGalleryItems, getGalleryItemById, uploadToGallery, deleteGalleryAsset } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getGalleryItems);
router.get('/:id', getGalleryItemById);
router.post('/upload', protect, authorize('admin', 'editor'), upload.single('galleryImage'), uploadToGallery);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteGalleryAsset);

module.exports = router;
