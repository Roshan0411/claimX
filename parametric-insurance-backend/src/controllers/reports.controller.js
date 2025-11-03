const PDFService = require('../services/pdf.service');

class ReportsController {
  // Generate and download receipt for a specific transaction
  async downloadReceipt(req, res) {
    try {
      const { transactionId } = req.params;
      const { userAccount } = req.body;

      // Mock transaction data - in production, fetch from database
      const mockTransactions = [
        {
          id: 'TXN001',
          type: 'policy_creation',
          description: 'Created Flight Insurance Policy #POL001',
          amount: '0.5 ETH',
          date: '2025-10-01',
          txHash: '0x1234567890abcdef1234567890abcdef12345678',
          status: 'Completed'
        },
        {
          id: 'TXN002',
          type: 'claim_submission',
          description: 'Submitted Claim #CLM001 for Flight Delay',
          amount: '2.5 ETH',
          date: '2025-10-14',
          txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
          status: 'Pending'
        },
        {
          id: 'TXN003',
          type: 'payout',
          description: 'Received Payout for Claim #CLM002',
          amount: '5.0 ETH',
          date: '2025-10-13',
          txHash: '0x9876543210fedcba9876543210fedcba98765432',
          status: 'Completed'
        },
        {
          id: 'TXN004',
          type: 'policy_creation',
          description: 'Created Weather Insurance Policy #POL002',
          amount: '1.2 ETH',
          date: '2025-09-15',
          txHash: '0xfedcba0987654321fedcba0987654321fedcba09',
          status: 'Completed'
        },
        {
          id: 'TXN005',
          type: 'premium_payment',
          description: 'Premium Payment for Policy #POL003',
          amount: '5.0 ETH',
          date: '2025-06-01',
          txHash: '0x1111222233334444111122223333444411112222',
          status: 'Completed'
        }
      ];

      // Find the transaction
      const transaction = mockTransactions.find(tx => tx.id === transactionId);
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Transaction not found'
        });
      }

      // Generate HTML receipt
      const receiptHTML = PDFService.generateReceiptHTML(transaction, userAccount);

      // Set response headers for HTML
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="ClaimX_Receipt_${transactionId}.html"`);

      // Send HTML content
      res.send(receiptHTML);

    } catch (error) {
      console.error('Error generating receipt:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate receipt',
        error: error.message
      });
    }
  }

  // Generate and download transaction history PDF
  async exportToPDF(req, res) {
    try {
      const { userAccount, filter = 'all' } = req.body;

      // Mock transaction data - in production, fetch from database based on user account
      let mockTransactions = [
        {
          id: 'TXN001',
          type: 'policy_creation',
          description: 'Created Flight Insurance Policy #POL001',
          amount: '0.5 ETH',
          date: '2025-10-01',
          txHash: '0x1234567890abcdef1234567890abcdef12345678',
          status: 'Completed'
        },
        {
          id: 'TXN002',
          type: 'claim_submission',
          description: 'Submitted Claim #CLM001 for Flight Delay',
          amount: '2.5 ETH',
          date: '2025-10-14',
          txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
          status: 'Pending'
        },
        {
          id: 'TXN003',
          type: 'payout',
          description: 'Received Payout for Claim #CLM002',
          amount: '5.0 ETH',
          date: '2025-10-13',
          txHash: '0x9876543210fedcba9876543210fedcba98765432',
          status: 'Completed'
        },
        {
          id: 'TXN004',
          type: 'policy_creation',
          description: 'Created Weather Insurance Policy #POL002',
          amount: '1.2 ETH',
          date: '2025-09-15',
          txHash: '0xfedcba0987654321fedcba0987654321fedcba09',
          status: 'Completed'
        },
        {
          id: 'TXN005',
          type: 'premium_payment',
          description: 'Premium Payment for Policy #POL003',
          amount: '5.0 ETH',
          date: '2025-06-01',
          txHash: '0x1111222233334444111122223333444411112222',
          status: 'Completed'
        }
      ];

      // Apply filter if specified
      if (filter !== 'all') {
        mockTransactions = mockTransactions.filter(tx => tx.type === filter);
      }

      // Generate HTML report
      const options = {
        filter: filter === 'all' ? 'All Transactions' : filter.replace('_', ' '),
        period: 'All Time'
      };

      const reportHTML = PDFService.generateHistoryReportHTML(mockTransactions, userAccount, options);

      // Set response headers for HTML
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `inline; filename="ClaimX_History_${userAccount.substring(0, 8)}.html"`);

      // Send HTML content
      res.send(reportHTML);

    } catch (error) {
      console.error('Error generating PDF report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate PDF report',
        error: error.message
      });
    }
  }

  // Generate and download transaction history CSV
  async exportToCSV(req, res) {
    try {
      const { userAccount, filter = 'all' } = req.body;

      // Mock transaction data - in production, fetch from database based on user account
      let mockTransactions = [
        {
          id: 'TXN001',
          type: 'policy_creation',
          description: 'Created Flight Insurance Policy #POL001',
          amount: '0.5 ETH',
          date: '2025-10-01',
          txHash: '0x1234567890abcdef1234567890abcdef12345678',
          status: 'Completed'
        },
        {
          id: 'TXN002',
          type: 'claim_submission',
          description: 'Submitted Claim #CLM001 for Flight Delay',
          amount: '2.5 ETH',
          date: '2025-10-14',
          txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
          status: 'Pending'
        },
        {
          id: 'TXN003',
          type: 'payout',
          description: 'Received Payout for Claim #CLM002',
          amount: '5.0 ETH',
          date: '2025-10-13',
          txHash: '0x9876543210fedcba9876543210fedcba98765432',
          status: 'Completed'
        },
        {
          id: 'TXN004',
          type: 'policy_creation',
          description: 'Created Weather Insurance Policy #POL002',
          amount: '1.2 ETH',
          date: '2025-09-15',
          txHash: '0xfedcba0987654321fedcba0987654321fedcba09',
          status: 'Completed'
        },
        {
          id: 'TXN005',
          type: 'premium_payment',
          description: 'Premium Payment for Policy #POL003',
          amount: '5.0 ETH',
          date: '2025-06-01',
          txHash: '0x1111222233334444111122223333444411112222',
          status: 'Completed'
        }
      ];

      // Apply filter if specified
      if (filter !== 'all') {
        mockTransactions = mockTransactions.filter(tx => tx.type === filter);
      }

      // Generate CSV content
      const csvContent = PDFService.generateCSV(mockTransactions, userAccount);

      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="ClaimX_History_${userAccount.substring(0, 8)}_${Date.now()}.csv"`);

      // Send CSV content
      res.send(csvContent);

    } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate CSV export',
        error: error.message
      });
    }
  }

  // Send email report (simulation)
  async emailReport(req, res) {
    try {
      const { userAccount, email, filter = 'all' } = req.body;

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email address'
        });
      }

      // Mock transaction data
      let mockTransactions = [
        {
          id: 'TXN001',
          type: 'policy_creation',
          description: 'Created Flight Insurance Policy #POL001',
          amount: '0.5 ETH',
          date: '2025-10-01',
          txHash: '0x1234567890abcdef1234567890abcdef12345678',
          status: 'Completed'
        },
        {
          id: 'TXN002',
          type: 'claim_submission',
          description: 'Submitted Claim #CLM001 for Flight Delay',
          amount: '2.5 ETH',
          date: '2025-10-14',
          txHash: '0xabcdef1234567890abcdef1234567890abcdef12',
          status: 'Pending'
        },
        {
          id: 'TXN003',
          type: 'payout',
          description: 'Received Payout for Claim #CLM002',
          amount: '5.0 ETH',
          date: '2025-10-13',
          txHash: '0x9876543210fedcba9876543210fedcba98765432',
          status: 'Completed'
        }
      ];

      // Apply filter if specified
      if (filter !== 'all') {
        mockTransactions = mockTransactions.filter(tx => tx.type === filter);
      }

      // Simulate email preparation and sending
      const reportData = {
        to: email,
        subject: 'ClaimX Insurance - Transaction History Report',
        userAccount,
        transactionCount: mockTransactions.length,
        reportDate: new Date().toISOString(),
        transactions: mockTransactions.map(tx => ({
          id: tx.id,
          description: tx.description,
          amount: tx.amount,
          date: tx.date,
          status: tx.status
        }))
      };

      // Simulate sending delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In production, integrate with email service here
      console.log('Email report would be sent to:', email);
      console.log('Report data:', reportData);

      res.json({
        success: true,
        message: `Transaction history report has been sent to ${email}`,
        reportId: `RPT-${Date.now()}-${userAccount.substring(0, 8)}`
      });

    } catch (error) {
      console.error('Error sending email report:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send email report',
        error: error.message
      });
    }
  }
}

module.exports = new ReportsController();