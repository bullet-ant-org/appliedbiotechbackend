const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, getProductBySpecificId, updateProduct, deleteProduct, duplicateProduct, updateDealOfTheWeek, getDealOfTheWeek, manageCartWishlist } = require('../controllers/shopController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.get('/products', getAllProducts);
router.get('/products/:id', getProductBySpecificId);
router.post('/products', protect, authorize('admin', 'editor'), upload.single('productImage'), createProduct);
router.put('/products/:id', protect, authorize('admin', 'editor'), upload.single('productImage'), updateProduct);
router.delete('/products/:id', protect, authorize('admin', 'editor'), deleteProduct);
router.post('/products/:id/duplicate', protect, authorize('admin', 'editor'), duplicateProduct);

router.get('/deal-of-the-week', getDealOfTheWeek);
router.post('/deal-of-the-week', protect, authorize('admin', 'editor'), updateDealOfTheWeek);
router.post('/user-engagement', protect, manageCartWishlist);

module.exports = router;
