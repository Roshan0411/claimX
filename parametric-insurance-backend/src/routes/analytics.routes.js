const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get comprehensive analytics (admin only)
router.get('/overview', analyticsController.getAnalytics);

// Get specific metric analytics (admin only)
router.get('/metrics/:metric', analyticsController.getMetricAnalytics);

// Get real-time dashboard data (admin only)
router.get('/realtime', analyticsController.getRealTimeData);

// Generate custom report (admin only)
router.post('/custom-report', analyticsController.generateCustomReport);

module.exports = router;