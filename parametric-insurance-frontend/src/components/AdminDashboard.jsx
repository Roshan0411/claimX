import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { getAllClaimsAPI, approveClaimAPI, rejectClaimAPI } from '../services/api';
import adminService from '../services/adminService';
import UserManagement from './UserManagement';
import OraclePanel from './OraclePanel';
import Settings from './Settings';
import Analytics from './Analytics';
import { toast } from 'react-toastify';
import '../styles/components.css';

const AdminDashboard = () => {
  const { account } = useWeb3Context();
  const [activeView, setActiveView] = useState('dashboard');
  const [adminStats] = useState({
    totalUsers: 1247,
    totalPolicies: 3891,
    totalClaims: 892,
    totalPayouts: 234.7,
    monthlyRevenue: 89.3,
    activeOracles: 12
  });

  const [loading, setLoading] = useState(false);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [oracleStats, setOracleStats] = useState(null);
  const [flaggedItems, setFlaggedItems] = useState([]);
  const [showModal, setShowModal] = useState(null);
  const [selectedClaim, setSelectedClaim] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load pending claims
      const claimsResponse = await getAllClaimsAPI();
      if (claimsResponse.success) {
        const pending = claimsResponse.data.filter(claim => claim.status === 0);
        setPendingClaims(pending);
      }

      // Load oracle stats
      const oracleResponse = await adminService.getOracleStats();
      if (oracleResponse.success) {
        setOracleStats(oracleResponse.data);
      }

      // Load flagged items
      const flaggedResponse = await adminService.getFlaggedItems();
      if (flaggedResponse.success) {
        setFlaggedItems(flaggedResponse.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleManageOracles = async () => {
    try {
      setLoading(true);
      const response = await adminService.getOracleStats();
      if (response.success) {
        setShowModal('oracles');
        setOracleStats(response.data);
      }
    } catch (error) {
      toast.error('Failed to load oracle management');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaims = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllClaims();
      if (response.success) {
        const pending = response.data.filter(claim => claim.status === 0);
        setPendingClaims(pending);
        setShowModal('claims');
      }
    } catch (error) {
      toast.error('Failed to load pending claims');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewFlags = async () => {
    try {
      setLoading(true);
      const response = await adminService.getFlaggedItems();
      if (response.success) {
        setFlaggedItems(response.data);
        setShowModal('flags');
      }
    } catch (error) {
      toast.error('Failed to load flagged items');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      toast.info('Generating comprehensive system report...');
      
      const response = await adminService.generateReport('comprehensive', '30days');
      if (response.success) {
        setShowModal('report');
        toast.success('Report generated successfully!');
      }
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimAction = async (claimId, action) => {
    try {
      setLoading(true);
      let response;
      
      if (action === 'approve') {
        response = await approveClaimAPI(claimId);
        toast.success(`Claim ${claimId} approved successfully!`);
      } else if (action === 'reject') {
        response = await rejectClaimAPI(claimId, 'Insufficient evidence');
        toast.success(`Claim ${claimId} rejected`);
      } else if (action === 'payout') {
        response = await adminService.processPayout(claimId);
        toast.success(`Payout processed for claim ${claimId}!`);
      }
      
      if (response && response.success) {
        // Reload claims
        await loadDashboardData();
      }
    } catch (error) {
      console.error('Claim action error:', error);
      toast.error(`Failed to ${action} claim: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const [systemHealth] = useState([
    { component: 'Smart Contract', status: 'healthy', uptime: '99.9%' },
    { component: 'IPFS Network', status: 'healthy', uptime: '99.7%' },
    { component: 'Oracle Network', status: 'warning', uptime: '98.2%' },
    { component: 'API Gateway', status: 'healthy', uptime: '99.8%' },
  ]);

  const [recentAlerts] = useState([
    { id: 1, type: 'warning', message: 'High volume of flight delay claims detected', time: '5 min ago' },
    { id: 2, type: 'info', message: 'New oracle node connected to network', time: '15 min ago' },
    { id: 3, type: 'success', message: 'Monthly payout batch processed successfully', time: '1 hour ago' },
    { id: 4, type: 'error', message: 'Oracle data discrepancy for Weather API #3', time: '2 hours ago' },
  ]);

  const [topPerformingPolicies] = useState([
    { type: 'Flight Insurance', count: 1842, revenue: '67.2 ETH', growth: '+12%' },
    { type: 'Weather Insurance', count: 1203, revenue: '45.8 ETH', growth: '+8%' },
    { type: 'Property Insurance', count: 846, revenue: '123.4 ETH', growth: '+15%' },
  ]);

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-welcome">
          <h1>👑 Admin Dashboard</h1>
          <p>System Administrator: {account?.substring(0, 6)}...{account?.substring(38)}</p>
        </div>
        <div className="system-status">
          <div className="status-indicator healthy">
            <span className="status-dot"></span>
            <span>System Healthy</span>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="admin-navigation">
        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            🏠 Dashboard
          </button>
          <button 
            className={`nav-tab ${activeView === 'users' ? 'active' : ''}`}
            onClick={() => setActiveView('users')}
          >
            👥 User Management
          </button>
          <button 
            className={`nav-tab ${activeView === 'oracles' ? 'active' : ''}`}
            onClick={() => setActiveView('oracles')}
          >
            🔮 Oracle Panel
          </button>
          <button 
            className={`nav-tab ${activeView === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveView('analytics')}
          >
            📊 Analytics
          </button>
          <button 
            className={`nav-tab ${activeView === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveView('settings')}
          >
            ⚙️ Settings
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="admin-content">
        {activeView === 'dashboard' && (
          <div className="dashboard-view">{renderDashboardView()}</div>
        )}
        {activeView === 'users' && <UserManagement />}
        {activeView === 'oracles' && <OraclePanel />}
        {activeView === 'analytics' && <Analytics />}
        {activeView === 'settings' && <Settings />}
      </div>

      {renderModals()}
    </div>
  );

  function renderDashboardView() {
    return (
      <>

      <div className="admin-stats-grid">
        <div className="admin-stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{adminStats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
            <span className="stat-change">+127 this month</span>
          </div>
        </div>
        <div className="admin-stat-card success">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>{adminStats.totalPolicies.toLocaleString()}</h3>
            <p>Total Policies</p>
            <span className="stat-change">+234 this month</span>
          </div>
        </div>
        <div className="admin-stat-card info">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{adminStats.totalClaims.toLocaleString()}</h3>
            <p>Total Claims</p>
            <span className="stat-change">+89 this month</span>
          </div>
        </div>
        <div className="admin-stat-card warning">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{adminStats.totalPayouts} ETH</h3>
            <p>Total Payouts</p>
            <span className="stat-change">+12.4 ETH</span>
          </div>
        </div>
        <div className="admin-stat-card revenue">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{adminStats.monthlyRevenue} ETH</h3>
            <p>Monthly Revenue</p>
            <span className="stat-change">+18.2%</span>
          </div>
        </div>
        <div className="admin-stat-card oracle">
          <div className="stat-icon">🔮</div>
          <div className="stat-content">
            <h3>{adminStats.activeOracles}</h3>
            <p>Active Oracles</p>
            <span className="stat-change">All online</span>
          </div>
        </div>
      </div>

      <div className="admin-grid">
        <div className="system-health-section">
          <h2>System Health</h2>
          <div className="health-list">
            {systemHealth.map((component, index) => (
              <div key={index} className="health-item">
                <div className={`health-status ${component.status}`}>
                  <span className="status-dot"></span>
                  <span className="component-name">{component.component}</span>
                </div>
                <div className="uptime">
                  Uptime: {component.uptime}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="alerts-section">
          <h2>Recent Alerts</h2>
          <div className="alerts-list">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                <div className="alert-icon">
                  {alert.type === 'error' && '🔴'}
                  {alert.type === 'warning' && '🟡'}
                  {alert.type === 'info' && '🔵'}
                  {alert.type === 'success' && '🟢'}
                </div>
                <div className="alert-content">
                  <p>{alert.message}</p>
                  <span className="alert-time">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="performance-section">
          <h2>Top Performing Policies</h2>
          <div className="performance-list">
            {topPerformingPolicies.map((policy, index) => (
              <div key={index} className="performance-item">
                <div className="policy-info">
                  <h4>{policy.type}</h4>
                  <p>{policy.count} policies</p>
                </div>
                <div className="policy-metrics">
                  <div className="revenue">{policy.revenue}</div>
                  <div className={`growth ${policy.growth.includes('+') ? 'positive' : 'negative'}`}>
                    {policy.growth}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-admin-actions">
          <h2>Quick Actions</h2>
          <div className="admin-actions-grid">
            <button 
              className="admin-action-btn primary"
              onClick={handleManageOracles}
              disabled={loading}
            >
              <span>🔮</span>
              Manage Oracles
            </button>
            <button 
              className="admin-action-btn success"
              onClick={handleApproveClaims}
              disabled={loading}
            >
              <span>✅</span>
              Approve Claims
              {pendingClaims.length > 0 && (
                <div className="notification-badge">{pendingClaims.length}</div>
              )}
            </button>
            <button 
              className="admin-action-btn warning"
              onClick={handleReviewFlags}
              disabled={loading}
            >
              <span>⚠️</span>
              Review Flags
              {flaggedItems.length > 0 && (
                <div className="notification-badge">{flaggedItems.length}</div>
              )}
            </button>
            <button 
              className="admin-action-btn info"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              <span>📊</span>
              Generate Report
            </button>
          </div>
        </div>
      </div>
      </>
    );
  }

  function renderModals() {
    return (
      <>
      {showModal === 'oracles' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔮 Oracle Management</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {oracleStats && (
                <div className="oracle-stats">
                  <div className="stat-grid">
                    <div className="stat-item">
                      <h4>Active Oracles</h4>
                      <p>{oracleStats.activeOracles}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Reliability</h4>
                      <p>{oracleStats.reliability}</p>
                    </div>
                    <div className="stat-item">
                      <h4>Avg Response</h4>
                      <p>{oracleStats.avgResponseTime}</p>
                    </div>
                  </div>
                  <div className="data-sources">
                    <h4>Data Sources</h4>
                    {oracleStats.dataSources?.map((source, index) => (
                      <div key={index} className={`source-item ${source.status}`}>
                        <span className="source-name">{source.name}</span>
                        <span className="source-status">{source.status}</span>
                        <span className="source-update">{source.lastUpdate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showModal === 'claims' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✅ Pending Claims Review</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="claims-list">
                {pendingClaims.map((claim) => (
                  <div key={claim.claimId} className="claim-review-item">
                    <div className="claim-info">
                      <h4>Claim #{claim.claimId}</h4>
                      <p><strong>Policy:</strong> #{claim.policyId}</p>
                      <p><strong>Amount:</strong> {claim.claimAmount} ETH</p>
                      <p><strong>Date:</strong> {new Date(claim.claimDate).toLocaleDateString()}</p>
                      {claim.eventDataDetails && (
                        <p><strong>Description:</strong> {claim.eventDataDetails.description}</p>
                      )}
                    </div>
                    <div className="claim-actions">
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleClaimAction(claim.claimId, 'approve')}
                        disabled={loading}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleClaimAction(claim.claimId, 'reject')}
                        disabled={loading}
                      >
                        Reject
                      </button>
                      <button 
                        className="btn btn-info btn-sm"
                        onClick={() => handleClaimAction(claim.claimId, 'payout')}
                        disabled={loading}
                      >
                        Process Payout
                      </button>
                    </div>
                  </div>
                ))}
                {pendingClaims.length === 0 && (
                  <div className="no-items">No pending claims to review</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal === 'flags' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚠️ Flagged Items Review</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="flagged-list">
                {flaggedItems.map((item) => (
                  <div key={item.id} className={`flagged-item ${item.severity}`}>
                    <div className="flag-info">
                      <h4>{item.item}</h4>
                      <p><strong>Type:</strong> {item.type.replace('_', ' ')}</p>
                      <p><strong>Reason:</strong> {item.reason}</p>
                      <p><strong>Severity:</strong> {item.severity}</p>
                      <p><strong>Time:</strong> {new Date(item.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flag-actions">
                      <button className="btn btn-success btn-sm">Resolve</button>
                      <button className="btn btn-warning btn-sm">Investigate</button>
                    </div>
                  </div>
                ))}
                {flaggedItems.length === 0 && (
                  <div className="no-items">No flagged items to review</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal === 'report' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📊 System Report Generated</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="report-success">
                <div className="success-icon">✅</div>
                <h4>Report Generated Successfully!</h4>
                <p>Your comprehensive system report has been generated and is ready for download.</p>
                
                <div className="report-preview">
                  <h5>Report Summary:</h5>
                  <ul>
                    <li>📊 Total Policies: {adminStats.totalPolicies}</li>
                    <li>📋 Total Claims: {adminStats.totalClaims}</li>
                    <li>💰 Total Payouts: {adminStats.totalPayouts} ETH</li>
                    <li>📈 Success Rate: 94.2%</li>
                    <li>⏱️ Avg Processing Time: 2.4 hours</li>
                  </ul>
                </div>
                
                <div className="report-actions">
                  <button className="btn btn-primary">
                    📥 Download PDF Report
                  </button>
                  <button className="btn btn-secondary">
                    📧 Email Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
    );
  }
};

export default AdminDashboard;