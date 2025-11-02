const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get system settings (admin only)
router.get('/system', settingsController.getSystemSettings);

// Update settings (admin only)
router.put('/system', settingsController.updateSettings);

// Get API configuration (admin only)
router.get('/api-config', settingsController.getApiConfig);

// Create system backup (admin only)
router.post('/backup', settingsController.createBackup);

// Test system connections (admin only)
router.get('/test-connections', settingsController.testConnections);

// Get system logs (admin only)
router.get('/logs', settingsController.getSystemLogs);

module.exports = router;