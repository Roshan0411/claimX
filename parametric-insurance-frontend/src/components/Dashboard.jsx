import React, { useState } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import Sidebar from './Sidebar';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import PolicyManager from './PolicyManager';
import ClaimManager from './ClaimManager';
import History from './History';
import Profile from './Profile';
import UserManagement from './UserManagement';
import OraclePanel from './OraclePanel';
import Analytics from './Analytics';
import Settings from './Settings';
import '../styles/components.css';

const Dashboard = ({ userRole, onLogout }) => {
  const { isConnected } = useWeb3Context();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Use the passed userRole instead of the context isAdmin
  const isAdmin = userRole === 'admin';

  const renderContent = () => {
    if (!isConnected) {
      return (
        <div className="connect-wallet-message">
          <div className="message-content">
            <h2>🔐 Welcome to Parametric Insurance</h2>
            <p>Connect your MetaMask wallet to access the platform</p>
            <div className="features-preview">
              <div className="feature-card">
                <h3>🏠 Property Insurance</h3>
                <p>Protect your property against natural disasters</p>
              </div>
              <div className="feature-card">
                <h3>✈️ Flight Insurance</h3>
                <p>Get compensation for flight delays and cancellations</p>
              </div>
              <div className="feature-card">
                <h3>🌦️ Weather Insurance</h3>
                <p>Coverage against adverse weather conditions</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'dashboard':
        return <UserDashboard />;
      case 'admin-dashboard':
        return isAdmin ? <AdminDashboard /> : <UserDashboard />;
      case 'policies':
      case 'all-policies':
      case 'create-policy':
        return <PolicyManager activeTab={activeSection} isAdmin={isAdmin} />;
      case 'claims':
      case 'all-claims':
      case 'submit-claim':
        return <ClaimManager activeTab={activeSection} isAdmin={isAdmin} />;
      case 'history':
        return <History />;
      case 'profile':
        return <Profile />;
      case 'oracle-panel':
        return isAdmin ? <OraclePanel /> : <UserDashboard />;
      case 'analytics':
        return isAdmin ? <Analytics /> : <UserDashboard />;
      case 'users':
        return isAdmin ? <UserManagement /> : <UserDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userRole={userRole}
      />
      <main className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;