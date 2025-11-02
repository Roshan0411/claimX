const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get all claims (admin only)
router.get('/claims/all', adminController.getAllClaims);

// Approve claim (admin only)
router.post('/approve-claim', adminController.approveClaim);

// Reject claim (admin only) 
router.post('/reject-claim', adminController.rejectClaim);

// Process payout (admin only)
router.post('/process-payout', adminController.processPayout);

// Generate report (admin only)
router.post('/generate-report', adminController.generateReport);

// Get flagged items (admin only)
router.get('/flagged-items', adminController.getFlaggedItems);

// Get dashboard stats (admin only)
router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;