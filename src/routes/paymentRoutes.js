const express = require('express');
const router = express.Router();
const { initializeTransaction, handleWebhook, getTransactionsLedgerLog, retrieveSpecificOrderContextViaTracking, retrieveSpecificOrderContextViaReference, modifyTrackingOrderStatus } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/initialize', initializeTransaction);
router.post('/webhook', handleWebhook);

router.get('/orders-ledger', protect, authorize('admin', 'editor'), getTransactionsLedgerLog);
router.get('/track/:code', retrieveSpecificOrderContextViaTracking);
router.get('/order-by-reference/:reference', retrieveSpecificOrderContextViaReference);
router.put('/orders/:id/status-update', protect, authorize('admin', 'editor'), modifyTrackingOrderStatus);

module.exports = router;
