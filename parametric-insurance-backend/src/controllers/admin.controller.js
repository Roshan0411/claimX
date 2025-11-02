const contractService = require('../services/contract.service');
const oracleService = require('../services/oracle.service');
const ipfsService = require('../services/ipfs.service');

// In-memory data store for demo purposes
let mockClaims = [
  {
    claimId: '1',
    policyId: '1',
    claimant: '0x742d35Cc6634C0532925a3b8D7b9212A8D2601f2',
    claimAmount: '1.5',
    status: 0, // 0 = Pending, 1 = Approved, 2 = Rejected
    claimDate: Date.now() - 86400000,
    eventDataHash: 'QmMockHash123',
    eventDataDetails: {
      description: 'Flight delayed by 3 hours',
      date: '2025-11-01',
      flightNumber: 'AA123'
    }
  },
  {
    claimId: '2',
    policyId: '2', 
    claimant: '0x8ba1f109551bD432803012645Hac136c30d0d0F9',
    claimAmount: '0.8',
    status: 0, // Pending
    claimDate: Date.now() - 172800000,
    eventDataHash: 'QmMockHash456',
    eventDataDetails: {
      description: 'Weather damage to property',
      date: '2025-10-30',
      location: 'New York'
    }
  },
  {
    claimId: '3',
    policyId: '3',
    claimant: '0x1234567890abcdef1234567890abcdef12345678',
    claimAmount: '2.1',
    status: 1, // Approved
    claimDate: Date.now() - 259200000,
    approvalDate: Date.now() - 86400000,
    eventDataHash: 'QmMockHash789',
    eventDataDetails: {
      description: 'Crop damage due to drought',
      date: '2025-10-28',
      location: 'Iowa'
    }
  }
];

class AdminController {
  // Get all claims for admin review
  async getAllClaims(req, res) {
    try {
      res.json({
        success: true,
        data: mockClaims
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Approve claim
  async approveClaim(req, res) {
    try {
      const { claimId } = req.body;
      
      // Find and update claim
      const claimIndex = mockClaims.findIndex(claim => claim.claimId === claimId);
      if (claimIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Claim not found'
        });
      }

      mockClaims[claimIndex].status = 1; // Approved
      mockClaims[claimIndex].approvalDate = Date.now();
      
      const result = {
        claimId,
        status: 'approved',
        transactionHash: '0xmock123...',
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `Claim ${claimId} approved successfully`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Reject claim
  async rejectClaim(req, res) {
    try {
      const { claimId, reason } = req.body;
      
      // Find and update claim
      const claimIndex = mockClaims.findIndex(claim => claim.claimId === claimId);
      if (claimIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'Claim not found'
        });
      }

      mockClaims[claimIndex].status = 2; // Rejected
      mockClaims[claimIndex].rejectionDate = Date.now();
      mockClaims[claimIndex].rejectionReason = reason || 'Insufficient evidence';
      
      const result = {
        claimId,
        status: 'rejected',
        reason: reason || 'Insufficient evidence',
        transactionHash: '0xmock456...',
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `Claim ${claimId} rejected`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Process payout
  async processPayout(req, res) {
    try {
      const { claimId } = req.body;
      
      // This would normally call the smart contract to process payout
      // For now, returning mock success
      const result = {
        claimId,
        amount: '1.5 ETH',
        transactionHash: '0xmockpayout789...',
        status: 'paid',
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `Payout for claim ${claimId} processed successfully`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Generate system report
  async generateReport(req, res) {
    try {
      const { reportType, dateRange } = req.body;
      
      const mockReport = {
        reportId: `RPT_${Date.now()}`,
        type: reportType || 'general',
        dateRange: dateRange || '30days',
        generatedAt: new Date().toISOString(),
        summary: {
          totalPolicies: 3891,
          totalClaims: 892,
          totalPayouts: '234.7 ETH',
          successRate: '94.2%',
          avgProcessingTime: '2.4 hours'
        },
        charts: {
          claimsByType: [
            { type: 'Flight Insurance', count: 523, percentage: 58.6 },
            { type: 'Weather Insurance', count: 234, percentage: 26.2 },
            { type: 'Property Insurance', count: 135, percentage: 15.2 }
          ],
          monthlyTrends: [
            { month: 'Oct', claims: 156, payouts: 78.5 },
            { month: 'Nov', claims: 189, payouts: 92.3 }
          ]
        },
        downloadUrl: `/api/reports/download/${Date.now()}.pdf`
      };

      res.json({
        success: true,
        message: 'Report generated successfully',
        data: mockReport
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get flagged items
  async getFlaggedItems(req, res) {
    try {
      const mockFlaggedItems = [
        {
          id: 'FLAG001',
          type: 'suspicious_claim',
          item: 'Claim #45',
          reason: 'Multiple claims from same location within 24h',
          severity: 'high',
          timestamp: Date.now() - 3600000
        },
        {
          id: 'FLAG002',
          type: 'oracle_discrepancy',
          item: 'Weather Data #123',
          reason: 'Data mismatch between multiple sources',
          severity: 'medium',
          timestamp: Date.now() - 7200000
        },
        {
          id: 'FLAG003',
          type: 'policy_anomaly',
          item: 'Policy #789',
          reason: 'Unusually high coverage amount requested',
          severity: 'low',
          timestamp: Date.now() - 10800000
        }
      ];

      res.json({
        success: true,
        data: mockFlaggedItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get admin dashboard stats
  async getDashboardStats(req, res) {
    try {
      const mockStats = {
        totalUsers: 1247,
        totalPolicies: 3891,
        totalClaims: 892,
        pendingClaims: 23,
        totalPayouts: 234.7,
        monthlyRevenue: 89.3,
        activeOracles: 12,
        systemHealth: {
          smartContract: { status: 'healthy', uptime: '99.9%' },
          ipfsNetwork: { status: 'healthy', uptime: '99.7%' },
          oracleNetwork: { status: 'warning', uptime: '98.2%' },
          apiGateway: { status: 'healthy', uptime: '99.8%' }
        },
        recentActivity: [
          { type: 'claim_approved', message: 'Claim #892 approved', time: '5 min ago' },
          { type: 'policy_created', message: 'New flight insurance policy created', time: '15 min ago' },
          { type: 'payout_processed', message: 'Payout of 2.3 ETH processed', time: '1 hour ago' }
        ]
      };

      res.json({
        success: true,
        data: mockStats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AdminController();