const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get all users (admin only)
router.get('/all', userController.getAllUsers);

// Get user details
router.get('/:userId', userController.getUserDetails);

// Update user status (admin only)
router.put('/:userId/status', userController.updateUserStatus);

// Verify user (admin only)
router.put('/:userId/verify', userController.verifyUser);

// Ban/unban user (admin only)
router.put('/:userId/ban', userController.banUser);

// Get user analytics (admin only)
router.get('/analytics/overview', userController.getUserAnalytics);

module.exports = router;