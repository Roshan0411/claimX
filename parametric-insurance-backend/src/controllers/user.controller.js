const contractService = require('../services/contract.service');

// In-memory data store for demo purposes
let mockUsers = [
  {
    id: '1',
    address: '0x742d35Cc6634C0532925a3b8D7b9212A8D2601f2',
    joinDate: '2025-10-15',
    role: 'user',
    status: 'active',
    totalPolicies: 3,
    totalClaims: 1,
    totalPremiums: '2.5 ETH',
    lastActivity: Date.now() - 3600000,
    riskScore: 'Low',
    verificationStatus: 'verified'
  },
  {
    id: '2',
    address: '0x8ba1f109551bD432803012645Hac136c30d0d0F9',
    joinDate: '2025-10-20',
    role: 'user',
    status: 'active',
    totalPolicies: 1,
    totalClaims: 0,
    totalPremiums: '0.8 ETH',
    lastActivity: Date.now() - 7200000,
    riskScore: 'Low',
    verificationStatus: 'pending'
  },
  {
    id: '3',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    joinDate: '2025-09-30',
    role: 'oracle',
    status: 'active',
    totalPolicies: 0,
    totalClaims: 0,
    totalPremiums: '0 ETH',
    lastActivity: Date.now() - 1800000,
    riskScore: 'N/A',
    verificationStatus: 'verified'
  },
  {
    id: '4',
    address: '0x9876543210fedcba9876543210fedcba98765432',
    joinDate: '2025-11-01',
    role: 'user',
    status: 'pending',
    totalPolicies: 0,
    totalClaims: 0,
    totalPremiums: '0 ETH',
    lastActivity: Date.now() - 900000,
    riskScore: 'Medium',
    verificationStatus: 'pending'
  },
  {
    id: '5',
    address: '0xabcdef1234567890abcdef1234567890abcdef12',
    joinDate: '2025-10-28',
    role: 'user',
    status: 'suspended',
    totalPolicies: 2,
    totalClaims: 3,
    totalPremiums: '1.2 ETH',
    lastActivity: Date.now() - 259200000,
    riskScore: 'High',
    verificationStatus: 'pending'
  }
];

class UserController {
  // Get all users
  async getAllUsers(req, res) {
    try {
      res.json({
        success: true,
        data: {
          users: mockUsers,
          totalUsers: mockUsers.length,
          activeUsers: mockUsers.filter(u => u.status === 'active').length,
          pendingVerification: mockUsers.filter(u => u.verificationStatus === 'pending').length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get user details
  async getUserDetails(req, res) {
    try {
      const { userId } = req.params;
      
      // Mock user details
      const mockUser = {
        id: userId,
        address: '0x742d35Cc6634C0532925a3b8D7b9212A8D2601f2',
        joinDate: '2025-10-15',
        role: 'user',
        status: 'active',
        profile: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1-555-0123',
          location: 'New York, USA'
        },
        statistics: {
          totalPolicies: 3,
          activePolicies: 2,
          totalClaims: 1,
          approvedClaims: 1,
          totalPremiums: '2.5 ETH',
          totalPayouts: '1.2 ETH'
        },
        activityHistory: [
          { action: 'Policy Created', date: Date.now() - 86400000, details: 'Flight Insurance Policy #123' },
          { action: 'Claim Submitted', date: Date.now() - 172800000, details: 'Claim #45 for delayed flight' },
          { action: 'Premium Paid', date: Date.now() - 259200000, details: '0.5 ETH premium payment' }
        ],
        riskAssessment: {
          score: 'Low',
          factors: ['No previous claims', 'Regular premium payments', 'Verified identity'],
          recommendation: 'Standard coverage'
        }
      };

      res.json({
        success: true,
        data: mockUser
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update user status
  async updateUserStatus(req, res) {
    try {
      const { userId } = req.params;
      const { status, reason } = req.body;

      // Find and update user
      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const oldStatus = mockUsers[userIndex].status;
      mockUsers[userIndex].status = status;
      mockUsers[userIndex].lastActivity = Date.now();

      const result = {
        userId,
        oldStatus,
        newStatus: status,
        reason: reason || 'Admin action',
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `User ${userId} status updated to ${status}`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Verify user
  async verifyUser(req, res) {
    try {
      const { userId } = req.params;
      const { verificationData } = req.body;

      // Find and update user
      const userIndex = mockUsers.findIndex(user => user.id === userId);
      if (userIndex === -1) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      const oldVerificationStatus = mockUsers[userIndex].verificationStatus;
      mockUsers[userIndex].verificationStatus = 'verified';
      mockUsers[userIndex].lastActivity = Date.now();

      const result = {
        userId,
        oldVerificationStatus,
        newVerificationStatus: 'verified',
        verifiedBy: 'admin',
        verificationData,
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `User ${userId} verified successfully`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get user analytics
  async getUserAnalytics(req, res) {
    try {
      const mockAnalytics = {
        userGrowth: [
          { month: 'Jul', users: 45, newUsers: 12 },
          { month: 'Aug', users: 67, newUsers: 22 },
          { month: 'Sep', users: 89, newUsers: 22 },
          { month: 'Oct', users: 134, newUsers: 45 },
          { month: 'Nov', users: 167, newUsers: 33 }
        ],
        userDistribution: {
          byRole: [
            { role: 'User', count: 1205, percentage: 96.6 },
            { role: 'Oracle', count: 12, percentage: 1.0 },
            { role: 'Admin', count: 3, percentage: 0.4 }
          ],
          byStatus: [
            { status: 'Active', count: 1189, percentage: 95.4 },
            { status: 'Inactive', count: 31, percentage: 2.5 },
            { status: 'Suspended', count: 27, percentage: 2.1 }
          ]
        },
        activityMetrics: {
          dailyActiveUsers: 892,
          weeklyActiveUsers: 1134,
          monthlyActiveUsers: 1189,
          averageSessionTime: '24.5 minutes'
        }
      };

      res.json({
        success: true,
        data: mockAnalytics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Ban/unban user
  async banUser(req, res) {
    try {
      const { userId } = req.params;
      const { reason, duration } = req.body;

      // Mock ban action
      const result = {
        userId,
        action: 'banned',
        reason: reason || 'Violation of terms',
        duration: duration || 'permanent',
        bannedBy: 'admin',
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `User ${userId} has been banned`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController();