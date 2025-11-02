import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import '../styles/components.css';

const Analytics = () => {
  const { account } = useWeb3Context();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('7d');
  const [refreshInterval, setRefreshInterval] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
    
    // Set up auto-refresh
    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 30000); // Refresh every 30 seconds
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock analytics data
      const mockAnalytics = {
        overview: {
          totalPolicies: 1247,
          activePolicies: 892,
          totalClaims: 234,
          approvedClaims: 187,
          rejectedClaims: 31,
          pendingClaims: 16,
          totalPremiums: '45.7 ETH',
          totalPayouts: '12.3 ETH',
          platformRevenue: '2.1 ETH',
          averageClaimTime: '4.2 hours',
          claimApprovalRate: 79.9,
          userGrowthRate: 15.3
        },
        timeSeriesData: {
          policies: [
            { date: '2024-01-14', value: 45 },
            { date: '2024-01-15', value: 52 },
            { date: '2024-01-16', value: 48 },
            { date: '2024-01-17', value: 61 },
            { date: '2024-01-18', value: 55 },
            { date: '2024-01-19', value: 67 },
            { date: '2024-01-20', value: 59 }
          ],
          claims: [
            { date: '2024-01-14', value: 12 },
            { date: '2024-01-15', value: 18 },
            { date: '2024-01-16', value: 15 },
            { date: '2024-01-17', value: 22 },
            { date: '2024-01-18', value: 19 },
            { date: '2024-01-19', value: 25 },
            { date: '2024-01-20', value: 21 }
          ],
          revenue: [
            { date: '2024-01-14', value: 2.3 },
            { date: '2024-01-15', value: 3.1 },
            { date: '2024-01-16', value: 2.8 },
            { date: '2024-01-17', value: 4.2 },
            { date: '2024-01-18', value: 3.9 },
            { date: '2024-01-19', value: 5.1 },
            { date: '2024-01-20', value: 4.7 }
          ]
        },
        policyTypes: [
          { type: 'Weather', count: 523, percentage: 41.9, revenue: '18.2 ETH' },
          { type: 'Flight', count: 412, percentage: 33.0, revenue: '15.8 ETH' },
          { type: 'Crop', count: 186, percentage: 14.9, revenue: '8.1 ETH' },
          { type: 'Event', count: 126, percentage: 10.1, revenue: '3.6 ETH' }
        ],
        userMetrics: {
          totalUsers: 2834,
          activeUsers: 1892,
          newUsersToday: 47,
          userRetentionRate: 84.2,
          averageUserPolicies: 1.4,
          usersByRegion: [
            { region: 'North America', users: 1142, percentage: 40.3 },
            { region: 'Europe', users: 851, percentage: 30.0 },
            { region: 'Asia', users: 567, percentage: 20.0 },
            { region: 'Other', users: 274, percentage: 9.7 }
          ]
        },
        oracleMetrics: {
          totalOracles: 12,
          activeOracles: 11,
          averageResponseTime: 1.2,
          accuracyRate: 98.7,
          dataPointsProcessed: 15420,
          oracleRewards: '3.2 ETH',
          oracleSlashings: '0.1 ETH'
        },
        riskMetrics: {
          riskScore: 7.3,
          portfolioExposure: '34.5 ETH',
          concentrationRisk: 'Medium',
          weatherRisk: 'High',
          flightRisk: 'Low',
          marketRisk: 'Medium',
          reserveRatio: 2.8
        }
      };

      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      toast.success(`Exporting data in ${format.toUpperCase()} format...`);
      // Export logic here
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const formatCurrency = (amount) => {
    if (typeof amount === 'string') return amount;
    return `${amount.toFixed(2)} ETH`;
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="analytics-panel">
      <div className="page-header">
        <h1>📊 Analytics Dashboard</h1>
        <div className="header-controls">
          <select 
            value={dateRange} 
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-selector"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button className="btn btn-secondary" onClick={loadAnalyticsData}>
            🔄 Refresh
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => exportData('csv')}
          >
            📤 Export
          </button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      {analyticsData && (
        <div className="analytics-overview">
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">📋</div>
              <div className="metric-content">
                <h3>{analyticsData.overview.totalPolicies.toLocaleString()}</h3>
                <p>Total Policies</p>
                <span className="metric-detail">
                  {analyticsData.overview.activePolicies.toLocaleString()} active
                </span>
              </div>
            </div>
            
            <div className="metric-card success">
              <div className="metric-icon">💰</div>
              <div className="metric-content">
                <h3>{analyticsData.overview.totalPremiums}</h3>
                <p>Total Premiums</p>
                <span className="metric-detail">
                  Revenue: {analyticsData.overview.platformRevenue}
                </span>
              </div>
            </div>
            
            <div className="metric-card warning">
              <div className="metric-icon">📄</div>
              <div className="metric-content">
                <h3>{analyticsData.overview.totalClaims}</h3>
                <p>Total Claims</p>
                <span className="metric-detail">
                  {formatPercentage(analyticsData.overview.claimApprovalRate)} approval rate
                </span>
              </div>
            </div>
            
            <div className="metric-card info">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <h3>{analyticsData.userMetrics.totalUsers.toLocaleString()}</h3>
                <p>Total Users</p>
                <span className="metric-detail">
                  +{analyticsData.userMetrics.newUsersToday} today
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'policies' ? 'active' : ''}`}
          onClick={() => setActiveTab('policies')}
        >
          📋 Policies
        </button>
        <button 
          className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          📄 Claims
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'risk' ? 'active' : ''}`}
          onClick={() => setActiveTab('risk')}
        >
          ⚠️ Risk
        </button>
        <button 
          className={`tab-btn ${activeTab === 'oracles' ? 'active' : ''}`}
          onClick={() => setActiveTab('oracles')}
        >
          🔮 Oracles
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && analyticsData && (
          <div className="overview-analytics">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>📈 Policy Creation Trend</h3>
                <div className="chart-container">
                  <div className="simple-chart">
                    {analyticsData.timeSeriesData.policies.map((item, index) => (
                      <div key={index} className="chart-bar">
                        <div 
                          className="bar" 
                          style={{ height: `${(item.value / 70) * 100}%` }}
                          title={`${formatDate(item.date)}: ${item.value}`}
                        ></div>
                        <span className="bar-label">{formatDate(item.date).split('/')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <h3>💸 Revenue Trend</h3>
                <div className="chart-container">
                  <div className="simple-chart">
                    {analyticsData.timeSeriesData.revenue.map((item, index) => (
                      <div key={index} className="chart-bar">
                        <div 
                          className="bar revenue" 
                          style={{ height: `${(item.value / 6) * 100}%` }}
                          title={`${formatDate(item.date)}: ${item.value} ETH`}
                        ></div>
                        <span className="bar-label">{formatDate(item.date).split('/')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3>🎯 Key Performance Indicators</h3>
                <div className="kpi-list">
                  <div className="kpi-item">
                    <span className="kpi-label">Claim Approval Rate:</span>
                    <span className="kpi-value success">
                      {formatPercentage(analyticsData.overview.claimApprovalRate)}
                    </span>
                  </div>
                  <div className="kpi-item">
                    <span className="kpi-label">Avg Claim Processing:</span>
                    <span className="kpi-value">{analyticsData.overview.averageClaimTime}</span>
                  </div>
                  <div className="kpi-item">
                    <span className="kpi-label">User Growth Rate:</span>
                    <span className="kpi-value success">
                      +{formatPercentage(analyticsData.overview.userGrowthRate)}
                    </span>
                  </div>
                  <div className="kpi-item">
                    <span className="kpi-label">Total Payouts:</span>
                    <span className="kpi-value">{analyticsData.overview.totalPayouts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'policies' && analyticsData && (
          <div className="policies-analytics">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>📊 Policy Distribution by Type</h3>
                <div className="policy-distribution">
                  {analyticsData.policyTypes.map((type, index) => (
                    <div key={index} className="policy-type-item">
                      <div className="policy-type-header">
                        <span className="policy-type-name">{type.type}</span>
                        <span className="policy-type-count">{type.count}</span>
                      </div>
                      <div className="policy-type-bar">
                        <div 
                          className="policy-type-fill" 
                          style={{ width: `${type.percentage}%` }}
                        ></div>
                      </div>
                      <div className="policy-type-details">
                        <span>{formatPercentage(type.percentage)}</span>
                        <span>{type.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stats-card">
                <h3>📋 Policy Metrics</h3>
                <div className="metric-grid">
                  <div className="metric-item">
                    <label>Active Policies:</label>
                    <span className="metric-value">{analyticsData.overview.activePolicies}</span>
                  </div>
                  <div className="metric-item">
                    <label>Expired Policies:</label>
                    <span className="metric-value">
                      {analyticsData.overview.totalPolicies - analyticsData.overview.activePolicies}
                    </span>
                  </div>
                  <div className="metric-item">
                    <label>Avg Premium:</label>
                    <span className="metric-value">0.037 ETH</span>
                  </div>
                  <div className="metric-item">
                    <label>Policy Renewal Rate:</label>
                    <span className="metric-value success">67.8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'claims' && analyticsData && (
          <div className="claims-analytics">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>📄 Claims Processing</h3>
                <div className="claims-chart">
                  <div className="claims-summary">
                    <div className="claim-status-item approved">
                      <div className="status-circle"></div>
                      <span>Approved: {analyticsData.overview.approvedClaims}</span>
                    </div>
                    <div className="claim-status-item rejected">
                      <div className="status-circle"></div>
                      <span>Rejected: {analyticsData.overview.rejectedClaims}</span>
                    </div>
                    <div className="claim-status-item pending">
                      <div className="status-circle"></div>
                      <span>Pending: {analyticsData.overview.pendingClaims}</span>
                    </div>
                  </div>
                  
                  <div className="claims-trend">
                    <h4>📈 Claims Trend</h4>
                    <div className="simple-chart">
                      {analyticsData.timeSeriesData.claims.map((item, index) => (
                        <div key={index} className="chart-bar">
                          <div 
                            className="bar claims" 
                            style={{ height: `${(item.value / 30) * 100}%` }}
                            title={`${formatDate(item.date)}: ${item.value} claims`}
                          ></div>
                          <span className="bar-label">{formatDate(item.date).split('/')[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3>⏱️ Processing Metrics</h3>
                <div className="processing-metrics">
                  <div className="metric-item">
                    <label>Avg Processing Time:</label>
                    <span className="metric-value">{analyticsData.overview.averageClaimTime}</span>
                  </div>
                  <div className="metric-item">
                    <label>Approval Rate:</label>
                    <span className="metric-value success">
                      {formatPercentage(analyticsData.overview.claimApprovalRate)}
                    </span>
                  </div>
                  <div className="metric-item">
                    <label>Total Payouts:</label>
                    <span className="metric-value">{analyticsData.overview.totalPayouts}</span>
                  </div>
                  <div className="metric-item">
                    <label>Dispute Rate:</label>
                    <span className="metric-value warning">2.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && analyticsData && (
          <div className="users-analytics">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>🌍 Users by Region</h3>
                <div className="region-distribution">
                  {analyticsData.userMetrics.usersByRegion.map((region, index) => (
                    <div key={index} className="region-item">
                      <div className="region-header">
                        <span className="region-name">{region.region}</span>
                        <span className="region-count">{region.users.toLocaleString()}</span>
                      </div>
                      <div className="region-bar">
                        <div 
                          className="region-fill" 
                          style={{ width: `${region.percentage}%` }}
                        ></div>
                      </div>
                      <span className="region-percentage">{formatPercentage(region.percentage)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="stats-card">
                <h3>👥 User Metrics</h3>
                <div className="user-metrics">
                  <div className="metric-item">
                    <label>Total Users:</label>
                    <span className="metric-value">{analyticsData.userMetrics.totalUsers.toLocaleString()}</span>
                  </div>
                  <div className="metric-item">
                    <label>Active Users:</label>
                    <span className="metric-value">{analyticsData.userMetrics.activeUsers.toLocaleString()}</span>
                  </div>
                  <div className="metric-item">
                    <label>Retention Rate:</label>
                    <span className="metric-value success">
                      {formatPercentage(analyticsData.userMetrics.userRetentionRate)}
                    </span>
                  </div>
                  <div className="metric-item">
                    <label>Avg Policies/User:</label>
                    <span className="metric-value">{analyticsData.userMetrics.averageUserPolicies}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && analyticsData && (
          <div className="risk-analytics">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>⚠️ Risk Assessment</h3>
                <div className="risk-overview">
                  <div className="risk-score">
                    <div className="score-circle">
                      <span className="score-value">{analyticsData.riskMetrics.riskScore}</span>
                      <span className="score-label">Risk Score</span>
                    </div>
                  </div>
                  
                  <div className="risk-factors">
                    <div className="risk-factor">
                      <span className="factor-name">Weather Risk:</span>
                      <span className={`factor-level ${analyticsData.riskMetrics.weatherRisk.toLowerCase()}`}>
                        {analyticsData.riskMetrics.weatherRisk}
                      </span>
                    </div>
                    <div className="risk-factor">
                      <span className="factor-name">Flight Risk:</span>
                      <span className={`factor-level ${analyticsData.riskMetrics.flightRisk.toLowerCase()}`}>
                        {analyticsData.riskMetrics.flightRisk}
                      </span>
                    </div>
                    <div className="risk-factor">
                      <span className="factor-name">Market Risk:</span>
                      <span className={`factor-level ${analyticsData.riskMetrics.marketRisk.toLowerCase()}`}>
                        {analyticsData.riskMetrics.marketRisk}
                      </span>
                    </div>
                    <div className="risk-factor">
                      <span className="factor-name">Concentration Risk:</span>
                      <span className={`factor-level ${analyticsData.riskMetrics.concentrationRisk.toLowerCase()}`}>
                        {analyticsData.riskMetrics.concentrationRisk}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3>💰 Portfolio Metrics</h3>
                <div className="portfolio-metrics">
                  <div className="metric-item">
                    <label>Portfolio Exposure:</label>
                    <span className="metric-value warning">{analyticsData.riskMetrics.portfolioExposure}</span>
                  </div>
                  <div className="metric-item">
                    <label>Reserve Ratio:</label>
                    <span className="metric-value success">{analyticsData.riskMetrics.reserveRatio}x</span>
                  </div>
                  <div className="metric-item">
                    <label>Diversification Index:</label>
                    <span className="metric-value">0.73</span>
                  </div>
                  <div className="metric-item">
                    <label>Capital Adequacy:</label>
                    <span className="metric-value success">142%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'oracles' && analyticsData && (
          <div className="oracles-analytics">
            <div className="analytics-grid">
              <div className="chart-card">
                <h3>🔮 Oracle Performance</h3>
                <div className="oracle-metrics">
                  <div className="performance-grid">
                    <div className="performance-metric">
                      <h4>Response Time</h4>
                      <div className="metric-visual">
                        <span className="metric-number">{analyticsData.oracleMetrics.averageResponseTime}s</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill good" 
                            style={{ width: '85%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="performance-metric">
                      <h4>Accuracy Rate</h4>
                      <div className="metric-visual">
                        <span className="metric-number">{analyticsData.oracleMetrics.accuracyRate}%</span>
                        <div className="metric-bar">
                          <div 
                            className="metric-fill excellent" 
                            style={{ width: '98%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="oracle-stats">
                    <div className="oracle-stat">
                      <span className="stat-label">Active Oracles:</span>
                      <span className="stat-value">{analyticsData.oracleMetrics.activeOracles}/{analyticsData.oracleMetrics.totalOracles}</span>
                    </div>
                    <div className="oracle-stat">
                      <span className="stat-label">Data Points Processed:</span>
                      <span className="stat-value">{analyticsData.oracleMetrics.dataPointsProcessed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="stats-card">
                <h3>💎 Oracle Economics</h3>
                <div className="oracle-economics">
                  <div className="metric-item">
                    <label>Total Rewards:</label>
                    <span className="metric-value success">{analyticsData.oracleMetrics.oracleRewards}</span>
                  </div>
                  <div className="metric-item">
                    <label>Total Slashings:</label>
                    <span className="metric-value warning">{analyticsData.oracleMetrics.oracleSlashings}</span>
                  </div>
                  <div className="metric-item">
                    <label>Network Utilization:</label>
                    <span className="metric-value">87.3%</span>
                  </div>
                  <div className="metric-item">
                    <label>Consensus Rate:</label>
                    <span className="metric-value success">94.1%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;