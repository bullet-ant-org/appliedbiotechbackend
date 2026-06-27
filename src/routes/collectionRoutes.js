const express = require('express');
const router = express.Router();
const { createCollection, getCollections, getCollectionById, updateCollection, deleteCollection } = require('../controllers/collectionController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/', getCollections);
router.get('/:id', getCollectionById);
router.post('/', protect, authorize('admin', 'editor'), upload.single('coverImage'), createCollection);
router.put('/:id', protect, authorize('admin', 'editor'), upload.single('coverImage'), updateCollection);
router.delete('/:id', protect, authorize('admin', 'editor'), deleteCollection);

module.exports = router;
