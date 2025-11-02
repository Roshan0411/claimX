import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import '../styles/components.css';

const Settings = () => {
  const { account } = useWeb3Context();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showModal, setShowModal] = useState(null);
  const [backupStatus, setBackupStatus] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Mock settings data
      const mockSettings = {
        general: {
          platformName: 'Parametric Insurance Platform',
          platformVersion: '1.2.3',
          environment: 'production',
          maintenanceMode: false,
          maxPoliciesPerUser: 10,
          minStakeAmount: '1 ETH',
          oracleTimeout: 300,
          claimProcessingFee: '0.01 ETH'
        },
        security: {
          twoFactorAuth: true,
          sessionTimeout: 3600,
          passwordPolicy: 'strong',
          encryptionEnabled: true,
          auditLogging: true,
          ipWhitelist: ['192.168.1.0/24', '10.0.0.0/8'],
          maxLoginAttempts: 5,
          accountLockoutDuration: 1800
        },
        oracle: {
          minOracleStake: '50 ETH',
          consensusThreshold: 66,
          oracleReputationMin: 85,
          disputeTimeWindow: 86400,
          slashingPercentage: 10,
          rewardPercentage: 5,
          dataSourceTimeout: 30,
          maxOracleNodes: 50
        },
        backup: {
          autoBackupEnabled: true,
          backupFrequency: 'daily',
          retentionPeriod: 30,
          backupLocation: 'AWS S3',
          lastBackup: Date.now() - 86400000,
          backupSize: '2.3 GB',
          backupStatus: 'healthy'
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          webhookUrl: 'https://api.example.com/webhook',
          notificationTypes: [
            { type: 'claim_submitted', enabled: true },
            { type: 'claim_approved', enabled: true },
            { type: 'claim_rejected', enabled: true },
            { type: 'policy_created', enabled: false },
            { type: 'oracle_alert', enabled: true }
          ]
        },
        api: {
          rateLimit: 100,
          rateLimitWindow: 3600,
          corsEnabled: true,
          allowedOrigins: ['https://app.insurance.com', 'https://admin.insurance.com'],
          apiVersion: 'v1',
          documentationUrl: 'https://docs.insurance.com/api'
        }
      };

      setSettings(mockSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingUpdate = async (category, key, value) => {
    try {
      setLoading(true);
      
      // Update settings logic here
      setSettings(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      }));
      
      toast.success(`${key} updated successfully`);
    } catch (error) {
      toast.error(`Failed to update ${key}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackupAction = async (action) => {
    try {
      setLoading(true);
      setBackupStatus('processing');
      
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      let message = '';
      switch (action) {
        case 'create':
          message = 'Backup created successfully';
          setBackupStatus('completed');
          break;
        case 'restore':
          message = 'System restored from backup';
          setBackupStatus('restored');
          break;
        case 'download':
          message = 'Backup download started';
          setBackupStatus('downloaded');
          break;
        default:
          message = 'Backup action completed';
      }
      
      toast.success(message);
      setShowModal(null);
    } catch (error) {
      toast.error(`Failed to ${action} backup`);
      setBackupStatus('error');
    } finally {
      setLoading(false);
      setTimeout(() => setBackupStatus(null), 5000);
    }
  };

  const testConnection = async (service) => {
    try {
      setLoading(true);
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        toast.success(`${service} connection test successful`);
      } else {
        toast.error(`${service} connection test failed`);
      }
    } catch (error) {
      toast.error(`Error testing ${service} connection`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="settings-panel">
      <div className="page-header">
        <h1>⚙️ System Settings</h1>
        <p>Configure platform settings and system parameters</p>
      </div>

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
          onClick={() => setActiveTab('general')}
        >
          🏢 General
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Security
        </button>
        <button 
          className={`tab-btn ${activeTab === 'oracle' ? 'active' : ''}`}
          onClick={() => setActiveTab('oracle')}
        >
          🔮 Oracle
        </button>
        <button 
          className={`tab-btn ${activeTab === 'backup' ? 'active' : ''}`}
          onClick={() => setActiveTab('backup')}
        >
          💾 Backup
        </button>
        <button 
          className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
          onClick={() => setActiveTab('notifications')}
        >
          🔔 Notifications
        </button>
        <button 
          className={`tab-btn ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          🌐 API
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'general' && settings && (
          <div className="general-settings">
            <div className="settings-section">
              <h3>Platform Configuration</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Platform Name:</label>
                  <input 
                    type="text" 
                    value={settings.general.platformName}
                    onChange={(e) => handleSettingUpdate('general', 'platformName', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>Version:</label>
                  <input 
                    type="text" 
                    value={settings.general.platformVersion}
                    readOnly
                  />
                </div>
                <div className="setting-item">
                  <label>Environment:</label>
                  <select 
                    value={settings.general.environment}
                    onChange={(e) => handleSettingUpdate('general', 'environment', e.target.value)}
                  >
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Maintenance Mode:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.general.maintenanceMode}
                      onChange={(e) => handleSettingUpdate('general', 'maintenanceMode', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Business Rules</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Max Policies per User:</label>
                  <input 
                    type="number" 
                    value={settings.general.maxPoliciesPerUser}
                    onChange={(e) => handleSettingUpdate('general', 'maxPoliciesPerUser', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Min Stake Amount:</label>
                  <input 
                    type="text" 
                    value={settings.general.minStakeAmount}
                    onChange={(e) => handleSettingUpdate('general', 'minStakeAmount', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>Oracle Timeout (seconds):</label>
                  <input 
                    type="number" 
                    value={settings.general.oracleTimeout}
                    onChange={(e) => handleSettingUpdate('general', 'oracleTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Claim Processing Fee:</label>
                  <input 
                    type="text" 
                    value={settings.general.claimProcessingFee}
                    onChange={(e) => handleSettingUpdate('general', 'claimProcessingFee', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && settings && (
          <div className="security-settings">
            <div className="settings-section">
              <h3>Authentication & Access</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Two-Factor Authentication:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingUpdate('security', 'twoFactorAuth', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>Session Timeout (seconds):</label>
                  <input 
                    type="number" 
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSettingUpdate('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Password Policy:</label>
                  <select 
                    value={settings.security.passwordPolicy}
                    onChange={(e) => handleSettingUpdate('security', 'passwordPolicy', e.target.value)}
                  >
                    <option value="basic">Basic</option>
                    <option value="medium">Medium</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Max Login Attempts:</label>
                  <input 
                    type="number" 
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => handleSettingUpdate('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Security Features</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Encryption Enabled:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.security.encryptionEnabled}
                      onChange={(e) => handleSettingUpdate('security', 'encryptionEnabled', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>Audit Logging:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.security.auditLogging}
                      onChange={(e) => handleSettingUpdate('security', 'auditLogging', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>Account Lockout Duration (seconds):</label>
                  <input 
                    type="number" 
                    value={settings.security.accountLockoutDuration}
                    onChange={(e) => handleSettingUpdate('security', 'accountLockoutDuration', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>IP Whitelist</h3>
              <div className="ip-whitelist">
                {settings.security.ipWhitelist.map((ip, index) => (
                  <div key={index} className="ip-item">
                    <span>{ip}</span>
                    <button className="btn btn-sm btn-danger">Remove</button>
                  </div>
                ))}
                <button className="btn btn-primary" onClick={() => setShowModal('add-ip')}>
                  Add IP Range
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'oracle' && settings && (
          <div className="oracle-settings">
            <div className="settings-section">
              <h3>Oracle Network Configuration</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Minimum Oracle Stake:</label>
                  <input 
                    type="text" 
                    value={settings.oracle.minOracleStake}
                    onChange={(e) => handleSettingUpdate('oracle', 'minOracleStake', e.target.value)}
                  />
                </div>
                <div className="setting-item">
                  <label>Consensus Threshold (%):</label>
                  <input 
                    type="number" 
                    min="51" 
                    max="100"
                    value={settings.oracle.consensusThreshold}
                    onChange={(e) => handleSettingUpdate('oracle', 'consensusThreshold', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Min Oracle Reputation:</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100"
                    value={settings.oracle.oracleReputationMin}
                    onChange={(e) => handleSettingUpdate('oracle', 'oracleReputationMin', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Max Oracle Nodes:</label>
                  <input 
                    type="number" 
                    value={settings.oracle.maxOracleNodes}
                    onChange={(e) => handleSettingUpdate('oracle', 'maxOracleNodes', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Dispute & Rewards</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Dispute Time Window (seconds):</label>
                  <input 
                    type="number" 
                    value={settings.oracle.disputeTimeWindow}
                    onChange={(e) => handleSettingUpdate('oracle', 'disputeTimeWindow', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Slashing Percentage (%):</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="50"
                    value={settings.oracle.slashingPercentage}
                    onChange={(e) => handleSettingUpdate('oracle', 'slashingPercentage', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Reward Percentage (%):</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="20"
                    value={settings.oracle.rewardPercentage}
                    onChange={(e) => handleSettingUpdate('oracle', 'rewardPercentage', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Data Source Timeout (seconds):</label>
                  <input 
                    type="number" 
                    value={settings.oracle.dataSourceTimeout}
                    onChange={(e) => handleSettingUpdate('oracle', 'dataSourceTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'backup' && settings && (
          <div className="backup-settings">
            <div className="settings-section">
              <h3>Backup Configuration</h3>
              <div className="backup-status">
                <div className="status-card">
                  <h4>📊 Backup Status</h4>
                  <div className="status-metrics">
                    <div className="metric">
                      <label>Status:</label>
                      <span className={`status-badge ${settings.backup.backupStatus === 'healthy' ? 'success' : 'warning'}`}>
                        {settings.backup.backupStatus}
                      </span>
                    </div>
                    <div className="metric">
                      <label>Last Backup:</label>
                      <span>{formatDate(settings.backup.lastBackup)}</span>
                    </div>
                    <div className="metric">
                      <label>Backup Size:</label>
                      <span>{settings.backup.backupSize}</span>
                    </div>
                    <div className="metric">
                      <label>Location:</label>
                      <span>{settings.backup.backupLocation}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <label>Auto Backup:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.backup.autoBackupEnabled}
                      onChange={(e) => handleSettingUpdate('backup', 'autoBackupEnabled', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>Backup Frequency:</label>
                  <select 
                    value={settings.backup.backupFrequency}
                    onChange={(e) => handleSettingUpdate('backup', 'backupFrequency', e.target.value)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Retention Period (days):</label>
                  <input 
                    type="number" 
                    value={settings.backup.retentionPeriod}
                    onChange={(e) => handleSettingUpdate('backup', 'retentionPeriod', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Backup Location:</label>
                  <select 
                    value={settings.backup.backupLocation}
                    onChange={(e) => handleSettingUpdate('backup', 'backupLocation', e.target.value)}
                  >
                    <option value="AWS S3">AWS S3</option>
                    <option value="Google Cloud">Google Cloud</option>
                    <option value="Azure Blob">Azure Blob</option>
                    <option value="Local Storage">Local Storage</option>
                  </select>
                </div>
              </div>

              <div className="backup-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleBackupAction('create')}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : '💾 Create Backup Now'}
                </button>
                <button 
                  className="btn btn-info"
                  onClick={() => handleBackupAction('download')}
                  disabled={loading}
                >
                  📥 Download Latest Backup
                </button>
                <button 
                  className="btn btn-warning"
                  onClick={() => setShowModal('restore-backup')}
                >
                  🔄 Restore from Backup
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => testConnection('backup storage')}
                  disabled={loading}
                >
                  🔧 Test Connection
                </button>
              </div>

              {backupStatus && (
                <div className={`backup-status-message ${backupStatus}`}>
                  {backupStatus === 'processing' && '⏳ Processing backup...'}
                  {backupStatus === 'completed' && '✅ Backup completed successfully'}
                  {backupStatus === 'error' && '❌ Backup failed'}
                  {backupStatus === 'restored' && '✅ System restored successfully'}
                  {backupStatus === 'downloaded' && '📥 Backup download initiated'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && settings && (
          <div className="notifications-settings">
            <div className="settings-section">
              <h3>Notification Channels</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Email Notifications:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingUpdate('notifications', 'emailNotifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>SMS Notifications:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingUpdate('notifications', 'smsNotifications', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>Webhook URL:</label>
                  <input 
                    type="url" 
                    value={settings.notifications.webhookUrl}
                    onChange={(e) => handleSettingUpdate('notifications', 'webhookUrl', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Notification Types</h3>
              <div className="notification-types">
                {settings.notifications.notificationTypes.map((notif, index) => (
                  <div key={index} className="notification-item">
                    <div className="notification-info">
                      <span className="notification-name">{notif.type.replace('_', ' ')}</span>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={notif.enabled}
                        onChange={(e) => {
                          const updatedTypes = [...settings.notifications.notificationTypes];
                          updatedTypes[index].enabled = e.target.checked;
                          handleSettingUpdate('notifications', 'notificationTypes', updatedTypes);
                        }}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'api' && settings && (
          <div className="api-settings">
            <div className="settings-section">
              <h3>API Configuration</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Rate Limit (requests/window):</label>
                  <input 
                    type="number" 
                    value={settings.api.rateLimit}
                    onChange={(e) => handleSettingUpdate('api', 'rateLimit', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>Rate Limit Window (seconds):</label>
                  <input 
                    type="number" 
                    value={settings.api.rateLimitWindow}
                    onChange={(e) => handleSettingUpdate('api', 'rateLimitWindow', parseInt(e.target.value))}
                  />
                </div>
                <div className="setting-item">
                  <label>CORS Enabled:</label>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={settings.api.corsEnabled}
                      onChange={(e) => handleSettingUpdate('api', 'corsEnabled', e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <label>API Version:</label>
                  <input 
                    type="text" 
                    value={settings.api.apiVersion}
                    onChange={(e) => handleSettingUpdate('api', 'apiVersion', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h3>Allowed Origins</h3>
              <div className="allowed-origins">
                {settings.api.allowedOrigins.map((origin, index) => (
                  <div key={index} className="origin-item">
                    <span>{origin}</span>
                    <button className="btn btn-sm btn-danger">Remove</button>
                  </div>
                ))}
                <button className="btn btn-primary" onClick={() => setShowModal('add-origin')}>
                  Add Origin
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h3>API Documentation</h3>
              <div className="api-docs">
                <div className="doc-item">
                  <label>Documentation URL:</label>
                  <input 
                    type="url" 
                    value={settings.api.documentationUrl}
                    onChange={(e) => handleSettingUpdate('api', 'documentationUrl', e.target.value)}
                  />
                </div>
                <div className="api-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => testConnection('API endpoints')}
                    disabled={loading}
                  >
                    🔧 Test API Health
                  </button>
                  <button className="btn btn-info">
                    📚 View Documentation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Restore Backup Modal */}
      {showModal === 'restore-backup' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔄 Restore from Backup</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="restore-warning">
                <div className="warning-message">
                  <span>⚠️</span>
                  <p>This action will restore the system to a previous state. All current data will be replaced with the backup data.</p>
                </div>
                <div className="backup-selection">
                  <label>Select Backup:</label>
                  <select>
                    <option>backup-2024-01-20-12-00.tar.gz (Latest)</option>
                    <option>backup-2024-01-19-12-00.tar.gz</option>
                    <option>backup-2024-01-18-12-00.tar.gz</option>
                  </select>
                </div>
                <div className="confirm-actions">
                  <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                    Cancel
                  </button>
                  <button 
                    className="btn btn-warning"
                    onClick={() => handleBackupAction('restore')}
                  >
                    Confirm Restore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add IP Modal */}
      {showModal === 'add-ip' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add IP Range</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="add-ip-form">
                <div className="form-group">
                  <label>IP Address/Range:</label>
                  <input type="text" placeholder="192.168.1.0/24" />
                  <small>Use CIDR notation for ranges (e.g., 192.168.1.0/24)</small>
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary">
                    Add IP Range
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Origin Modal */}
      {showModal === 'add-origin' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Allowed Origin</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="add-origin-form">
                <div className="form-group">
                  <label>Origin URL:</label>
                  <input type="url" placeholder="https://app.example.com" />
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary">
                    Add Origin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;