import React from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import '../styles/components.css';

const Sidebar = ({ activeSection, setActiveSection, collapsed, setCollapsed, userRole }) => {
  const { isConnected } = useWeb3Context();

  // Use the passed userRole instead of context
  const isAdmin = userRole === 'admin';

  const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'policies', label: 'My Policies', icon: '📄' },
    { id: 'create-policy', label: 'Create Policy', icon: '➕' },
    { id: 'claims', label: 'My Claims', icon: '📋' },
    { id: 'submit-claim', label: 'Submit Claim', icon: '📝' },
    { id: 'history', label: 'History', icon: '📚' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const adminMenuItems = [
    { id: 'admin-dashboard', label: 'Admin Dashboard', icon: '🎛️' },
    { id: 'all-policies', label: 'All Policies', icon: '📑' },
    { id: 'all-claims', label: 'All Claims', icon: '📊' },
    { id: 'oracle-panel', label: 'Oracle Panel', icon: '🔮' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? '☰' : '✕'}
        </button>
        {!collapsed && (
          <div className="sidebar-title">
            <h3>🛡️ Insurance</h3>
            <span className={`role-badge ${userRole}`}>
              {isAdmin ? '👑 Admin' : '👤 User'}
            </span>
          </div>
        )}
      </div>

      <div className="sidebar-content">
        {!isConnected ? (
          <div className="sidebar-message">
            {!collapsed && (
              <p>Connect your wallet to access features</p>
            )}
          </div>
        ) : (
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
                title={collapsed ? item.label : ''}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {!collapsed && <span className="sidebar-label">{item.label}</span>}
              </button>
            ))}
          </nav>
        )}
      </div>

      {!collapsed && (
        <div className="sidebar-footer">
          <div className="sidebar-stats">
            <div className="stat-item">
              <span className="stat-icon">📄</span>
              <span className="stat-text">Policies: 0</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📋</span>
              <span className="stat-text">Claims: 0</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;