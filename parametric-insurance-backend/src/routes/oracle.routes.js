const express = require('express');
const router = express.Router();
const oracleController = require('../controllers/oracle.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { validateWeatherQuery, validateOracleData } = require('../utils/helpers');

// Get current weather data
router.get('/weather/current',
  validateWeatherQuery,
  oracleController.getWeatherData
);

// Get historical weather data
router.get('/weather/historical',
  validateWeatherQuery,
  oracleController.getHistoricalWeatherData
);

// Validate claim against oracle data
router.post('/validate-claim',
  authMiddleware.optional,
  oracleController.validateClaim
);

// Submit oracle data (admin only)
router.post('/data',
  authMiddleware.required,
  validateOracleData,
  oracleController.submitOracleData
);

// Get oracle data
router.get('/data/:dataId?',
  oracleController.getOracleData
);

// Get oracle statistics
router.get('/stats/overview',
  oracleController.getOracleStats
);

// Update oracle configuration (admin only)
router.put('/config',
  authMiddleware.required,
  oracleController.updateOracleConfig
);

// Test oracle connectivity
router.get('/test/:serviceType?',
  oracleController.testOracleConnectivity
);

// Get supported data sources
router.get('/sources',
  oracleController.getDataSources
);

// Process scheduled updates (admin only)
router.post('/process-updates',
  authMiddleware.required,
  oracleController.processScheduledUpdates
);

// Approve claim (oracle/admin only)
router.post('/approve-claim',
  authMiddleware.optional,
  oracleController.approveClaim
);

// Reject claim (oracle/admin only)
router.post('/reject-claim',
  authMiddleware.optional,
  oracleController.rejectClaim
);

module.exports = router;