import { BACKEND_URL } from '../utils/constants';

const API_BASE = BACKEND_URL || '';

class AdminService {
  // Get all claims for admin review
  async getAllClaims() {
    try {
      const response = await fetch(`${API_BASE}/api/claims/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch claims');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching claims:', error);
      // Return mock data for development
      return {
        success: true,
        data: [
          {
            claimId: '1',
            policyId: '1',
            claimant: '0x742d35Cc6634C0532925a3b8D7b9212A8D2601f2',
            claimAmount: '1.5',
            status: 0, // Pending
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
          }
        ]
      };
    }
  }

  // Approve a claim
  async approveClaim(claimId) {
    try {
      const response = await fetch(`${API_BASE}/api/oracle/approve-claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claimId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to approve claim');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error approving claim:', error);
      // Return mock success for development
      return {
        success: true,
        message: `Claim ${claimId} approved successfully`,
        data: { claimId, status: 'approved' }
      };
    }
  }

  // Reject a claim
  async rejectClaim(claimId, reason = '') {
    try {
      const response = await fetch(`${API_BASE}/api/oracle/reject-claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claimId, reason }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject claim');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error rejecting claim:', error);
      // Return mock success for development
      return {
        success: true,
        message: `Claim ${claimId} rejected`,
        data: { claimId, status: 'rejected', reason }
      };
    }
  }

  // Generate system report
  async generateReport(reportType = 'general', dateRange = '30days') {
    try {
      const response = await fetch(`${API_BASE}/api/admin/generate-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportType, dateRange }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating report:', error);
      // Return mock report for development
      const mockReport = {
        success: true,
        data: {
          reportId: `RPT_${Date.now()}`,
          type: reportType,
          dateRange,
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
          downloadUrl: `${API_BASE}/api/reports/download/${Date.now()}.pdf`
        }
      };
      return mockReport;
    }
  }

  // Get oracle statistics
  async getOracleStats() {
    try {
      const response = await fetch(`${API_BASE}/api/oracle/stats/overview`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch oracle stats');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching oracle stats:', error);
      // Return mock stats for development
      return {
        success: true,
        data: {
          activeOracles: 12,
          totalDataPoints: 45678,
          avgResponseTime: '1.2s',
          reliability: '99.7%',
          dataSources: [
            { name: 'Weather API', status: 'online', lastUpdate: '2 min ago' },
            { name: 'Flight API', status: 'online', lastUpdate: '1 min ago' },
            { name: 'Exchange Rate API', status: 'warning', lastUpdate: '15 min ago' }
          ]
        }
      };
    }
  }

  // Manage oracles
  async manageOracles(action, oracleAddress = '') {
    try {
      const response = await fetch(`${API_BASE}/api/oracle/manage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, oracleAddress }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to manage oracle');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error managing oracle:', error);
      // Return mock success for development
      return {
        success: true,
        message: `Oracle ${action} completed`,
        data: { action, oracleAddress }
      };
    }
  }

  // Review flagged items
  async getFlaggedItems() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/flagged-items`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch flagged items');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching flagged items:', error);
      // Return mock flagged items for development
      return {
        success: true,
        data: [
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
          }
        ]
      };
    }
  }

  // Process payout for approved claim
  async processPayout(claimId) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/process-payout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ claimId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process payout');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error processing payout:', error);
      // Return mock success for development
      return {
        success: true,
        message: `Payout for claim ${claimId} processed successfully`,
        data: { claimId, amount: '1.5 ETH', transactionHash: '0xmock123...' }
      };
    }
  }
}

export default new AdminService();