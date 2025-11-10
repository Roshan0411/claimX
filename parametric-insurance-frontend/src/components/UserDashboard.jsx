import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import '../styles/components.css';

const UserDashboard = ({ onNavigate }) => {
  const { account, isConnected } = useWeb3Context();
  const [stats, setStats] = useState({
    totalPolicies: 3,
    activeClaims: 1,
    totalCoverage: 25.5,
    pendingPayouts: 2.1
  });

  const [recentActivities] = useState([
    { id: 1, type: 'policy', action: 'Created', item: 'Flight Insurance Policy #001', date: '2025-10-15', amount: '5 ETH' },
    { id: 2, type: 'claim', action: 'Submitted', item: 'Weather Claim #003', date: '2025-10-14', amount: '2.1 ETH' },
    { id: 3, type: 'payout', action: 'Received', item: 'Claim Payout #002', date: '2025-10-13', amount: '3.2 ETH' },
    { id: 4, type: 'policy', action: 'Created', item: 'Property Insurance #007', date: '2025-10-12', amount: '10 ETH' },
  ]);

  const [quickActions] = useState([
    { id: 'create-policy', title: 'Create New Policy', icon: '➕', description: 'Start a new insurance policy' },
    { id: 'submit-claim', title: 'Submit Claim', icon: '📝', description: 'File a new insurance claim' },
    { id: 'view-policies', title: 'View Policies', icon: '📄', description: 'Manage your policies' },
    { id: 'check-weather', title: 'Weather Oracle', icon: '🌦️', description: 'Check weather data' },
  ]);

  const handleQuickAction = (actionId) => {
    if (!onNavigate) {
      console.warn('onNavigate prop not provided to UserDashboard');
      return;
    }
    
    switch (actionId) {
      case 'create-policy':
        onNavigate('create-policy');
        break;
      case 'submit-claim':
        onNavigate('submit-claim');
        break;
      case 'view-policies':
        onNavigate('policies');
        break;
      case 'check-weather':
        onNavigate('oracle-panel');
        break;
      default:
        console.warn('Unknown action:', actionId);
    }
  };

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back! 👋</h1>
          <p>Account: {account?.substring(0, 6)}...{account?.substring(38)}</p>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <span className="stat-value">{stats.totalPolicies}</span>
            <span className="stat-label">Active Policies</span>
          </div>
          <div className="header-stat">
            <span className="stat-value">{stats.totalCoverage} ETH</span>
            <span className="stat-label">Total Coverage</span>
          </div>
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card primary">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>{stats.totalPolicies}</h3>
            <p>Total Policies</p>
            <span className="stat-change">+2 this month</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.activeClaims}</h3>
            <p>Active Claims</p>
            <span className="stat-change">Processing</span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.totalCoverage} ETH</h3>
            <p>Total Coverage</p>
            <span className="stat-change">+15.2 ETH</span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{stats.pendingPayouts} ETH</h3>
            <p>Pending Payouts</p>
            <span className="stat-change">2 claims</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <div key={action.id} className="quick-action-card">
                <div className="action-icon">{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button 
                  className="action-button"
                  onClick={() => handleQuickAction(action.id)}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="recent-activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'policy' && '📄'}
                  {activity.type === 'claim' && '📋'}
                  {activity.type === 'payout' && '💰'}
                </div>
                <div className="activity-content">
                  <h4>{activity.action} {activity.item}</h4>
                  <p>{activity.date}</p>
                </div>
                <div className="activity-amount">
                  {activity.amount}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-insights">
        <div className="insight-card">
          <h3>🎯 Policy Recommendations</h3>
          <ul>
            <li>Consider flight insurance for your upcoming trip to Europe</li>
            <li>Winter weather insurance available for the upcoming season</li>
            <li>Property insurance rates are currently at historic lows</li>
          </ul>
        </div>
        <div className="insight-card">
          <h3>📊 Market Insights</h3>
          <ul>
            <li>Flight delay claims increased by 23% this month</li>
            <li>Weather-related payouts: $125K this quarter</li>
            <li>Average claim processing time: 2.3 days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;