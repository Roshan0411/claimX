const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reports.controller');

// Download PDF receipt for a specific transaction
router.post('/receipt/:transactionId', reportsController.downloadReceipt);

// Export transaction history to PDF
router.post('/export/pdf', reportsController.exportToPDF);

// Export transaction history to CSV
router.post('/export/csv', reportsController.exportToCSV);

// Send email report
router.post('/email', reportsController.emailReport);

module.exports = router;