class SettingsController {
  // Get system settings
  async getSystemSettings(req, res) {
    try {
      const mockSettings = {
        general: {
          platformName: 'Parametric Insurance Platform',
          version: '1.0.0',
          environment: 'production',
          maintenance: false,
          debugMode: false
        },
        blockchain: {
          network: 'Sepolia',
          chainId: 11155111,
          contractAddress: '0x8B78C834a438Ec7f566806cf61aCfc80eDf69e81',
          gasLimit: 300000,
          gasPriceMultiplier: 1.2,
          confirmations: 3
        },
        oracle: {
          enabled: true,
          updateInterval: 300, // seconds
          dataSources: {
            weather: {
              enabled: true,
              apiKey: 'configured',
              rateLimit: 1000
            },
            flight: {
              enabled: true,
              apiKey: 'configured',
              rateLimit: 500
            },
            exchange: {
              enabled: true,
              apiKey: 'configured',
              rateLimit: 100
            }
          },
          validationThreshold: 0.8
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 3600, // seconds
          maxLoginAttempts: 5,
          passwordPolicy: {
            minLength: 8,
            requireUppercase: true,
            requireNumbers: true,
            requireSymbols: true
          },
          ipWhitelist: [],
          rateLimiting: {
            enabled: true,
            requestsPerMinute: 100
          }
        },
        notifications: {
          email: {
            enabled: true,
            smtp: {
              host: 'configured',
              port: 587,
              secure: true
            }
          },
          webhooks: {
            enabled: true,
            endpoints: [
              { name: 'Slack', url: 'configured', events: ['claim_approved', 'high_value_policy'] }
            ]
          },
          pushNotifications: {
            enabled: false
          }
        },
        policies: {
          maxCoverageAmount: '100 ETH',
          minPremiumPercentage: 0.5,
          maxPolicyDuration: 365, // days
          claimProcessingTimeout: 72, // hours
          automaticApprovalThreshold: '1 ETH'
        },
        fees: {
          platformFeePercentage: 2.5,
          oracleFeePercentage: 0.5,
          withdrawalFee: '0.001 ETH',
          minimumPoolBalance: '50 ETH'
        }
      };

      res.json({
        success: true,
        data: mockSettings
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update settings
  async updateSettings(req, res) {
    try {
      const { category, settings } = req.body;

      // Mock settings update
      const result = {
        category,
        updatedSettings: settings,
        updatedBy: 'admin',
        timestamp: new Date().toISOString(),
        changes: Object.keys(settings).length
      };

      res.json({
        success: true,
        message: `${category} settings updated successfully`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get API configuration
  async getApiConfig(req, res) {
    try {
      const mockApiConfig = {
        endpoints: {
          policies: '/api/policies',
          claims: '/api/claims',
          oracle: '/api/oracle',
          admin: '/api/admin',
          users: '/api/users'
        },
        rateLimit: {
          windowMs: 60000,
          maxRequests: 100,
          skipSuccessfulRequests: false
        },
        cors: {
          origins: ['https://parametric-insurance.vercel.app'],
          credentials: true,
          methods: ['GET', 'POST', 'PUT', 'DELETE']
        },
        authentication: {
          required: true,
          type: 'wallet',
          sessionDuration: 3600
        },
        versioning: {
          current: 'v1',
          supported: ['v1'],
          deprecated: []
        }
      };

      res.json({
        success: true,
        data: mockApiConfig
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Backup system data
  async createBackup(req, res) {
    try {
      const { includeUserData, includeTransactions } = req.body;

      const mockBackup = {
        backupId: `BACKUP_${Date.now()}`,
        timestamp: new Date().toISOString(),
        size: '145.7 MB',
        includes: {
          systemSettings: true,
          userData: includeUserData || false,
          transactions: includeTransactions || false,
          policies: true,
          claims: true
        },
        downloadUrl: `/api/backups/download/${Date.now()}.zip`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      res.json({
        success: true,
        message: 'Backup created successfully',
        data: mockBackup
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Test system connections
  async testConnections(req, res) {
    try {
      const mockConnectionTests = {
        blockchain: {
          status: 'connected',
          latency: '45ms',
          blockNumber: 18567890,
          gasPrice: '15 gwei'
        },
        ipfs: {
          status: 'connected',
          latency: '120ms',
          gateway: 'https://gateway.pinata.cloud',
          version: '0.14.0'
        },
        oracles: {
          weather: { status: 'connected', latency: '89ms', lastUpdate: '2 min ago' },
          flight: { status: 'connected', latency: '156ms', lastUpdate: '1 min ago' },
          exchange: { status: 'warning', latency: '450ms', lastUpdate: '15 min ago' }
        },
        database: {
          status: 'connected',
          latency: '12ms',
          connections: 25,
          maxConnections: 100
        }
      };

      res.json({
        success: true,
        data: mockConnectionTests,
        testedAt: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get system logs
  async getSystemLogs(req, res) {
    try {
      const { level = 'all', limit = 100 } = req.query;

      const mockLogs = [
        { level: 'info', message: 'System startup completed', timestamp: Date.now() - 300000 },
        { level: 'warning', message: 'High memory usage detected', timestamp: Date.now() - 600000 },
        { level: 'info', message: 'Oracle data update successful', timestamp: Date.now() - 900000 },
        { level: 'error', message: 'Failed to connect to external API', timestamp: Date.now() - 1200000 },
        { level: 'info', message: 'User authentication successful', timestamp: Date.now() - 1500000 }
      ];

      const filteredLogs = level === 'all' 
        ? mockLogs 
        : mockLogs.filter(log => log.level === level);

      res.json({
        success: true,
        data: filteredLogs.slice(0, limit),
        totalLogs: filteredLogs.length,
        level,
        limit
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SettingsController();