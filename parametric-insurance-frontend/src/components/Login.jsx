import React, { useState } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { CHAIN_ID, CHAIN_NAME, RPC_URL } from '../utils/constants';
import '../styles/components.css';

const Login = ({ onLogin }) => {
  const { connectWallet, isConnected, account, isAdmin, userRole, chainId, switchToCorrectNetwork } = useWeb3Context();
  const [selectedRole, setSelectedRole] = useState('user');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showNetworkInfo, setShowNetworkInfo] = useState(false);

  // Simple admin password (in real app, this would be more secure)
  const ADMIN_PASSWORD = 'admin123';

  const isOnCorrectNetwork = chainId === CHAIN_ID;

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setShowPasswordField(role === 'admin');
    setAdminPassword('');
  };

  const handleLogin = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (selectedRole === 'admin') {
      if (adminPassword !== ADMIN_PASSWORD) {
        alert('Invalid admin password!');
        return;
      }
      // Force admin role
      onLogin('admin');
    } else {
      onLogin('user');
    }
  };

  const handleContinueAsConnected = () => {
    onLogin(userRole);
  };

  if (isConnected) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>🛡️ Parametric Insurance</h1>
            <p>Wallet Connected Successfully!</p>
          </div>

          <div className="wallet-info-display">
            <div className="connected-wallet">
              <h3>Connected Wallet</h3>
              <p className="wallet-address">{account}</p>
              <span className={`auto-role-badge ${isAdmin ? 'admin' : 'user'}`}>
                {isAdmin ? '👑 Admin Detected' : '👤 User Account'}
              </span>
            </div>
            
            <div className="network-status-connected">
              <div className={`network-indicator ${isOnCorrectNetwork ? 'correct' : 'wrong'}`}>
                <span>{isOnCorrectNetwork ? '✅' : '❌'}</span>
                <div>
                  <p><strong>Network:</strong> {CHAIN_NAME}</p>
                  <p><strong>Chain ID:</strong> {chainId} {isOnCorrectNetwork ? '(Correct)' : `(Expected: ${CHAIN_ID})`}</p>
                </div>
              </div>
              
              {!isOnCorrectNetwork && (
                <button className="switch-network-btn-small" onClick={switchToCorrectNetwork}>
                  Switch to {CHAIN_NAME}
                </button>
              )}
            </div>
          </div>

          <div className="role-selection">
            <h3>Select Your Access Level</h3>
            <div className="role-buttons">
              <button 
                className={`role-btn ${selectedRole === 'user' ? 'active' : ''}`}
                onClick={() => handleRoleSelection('user')}
              >
                <div className="role-icon">👤</div>
                <div className="role-info">
                  <h4>User Access</h4>
                  <p>Create policies, submit claims, view history</p>
                </div>
              </button>
              
              <button 
                className={`role-btn ${selectedRole === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleSelection('admin')}
              >
                <div className="role-icon">👑</div>
                <div className="role-info">
                  <h4>Admin Access</h4>
                  <p>Manage all policies, approve claims, system analytics</p>
                </div>
              </button>
            </div>

            {showPasswordField && (
              <div className="admin-password-section">
                <label>Admin Password</label>
                <input 
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="password-input"
                />
                <p className="password-hint">Hint: admin123</p>
              </div>
            )}
          </div>

          <div className="login-actions">
            <button className="continue-btn" onClick={handleLogin}>
              Continue as {selectedRole === 'admin' ? 'Admin' : 'User'}
            </button>
            
            {isAdmin && (
              <button className="quick-continue-btn" onClick={handleContinueAsConnected}>
                Quick Continue as {isAdmin ? 'Admin' : 'User'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🛡️ Parametric Insurance</h1>
          <p>Decentralized Insurance Platform</p>
        </div>

        <div className="welcome-content">
          <div className="feature-highlight">
            <h2>Welcome to the Future of Insurance</h2>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">✈️</span>
                <h4>Flight Insurance</h4>
                <p>Automatic payouts for flight delays and cancellations</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌦️</span>
                <h4>Weather Protection</h4>
                <p>Coverage against extreme weather events</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <h4>Property Insurance</h4>
                <p>Smart contracts for property protection</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔗</span>
                <h4>Blockchain Powered</h4>
                <p>Transparent, trustless, and automated</p>
              </div>
            </div>
          </div>

          <div className="access-types">
            <h3>Choose Your Access Type</h3>
            <div className="access-grid">
              <div className="access-card user">
                <h4>👤 User Access</h4>
                <ul>
                  <li>Create insurance policies</li>
                  <li>Submit and track claims</li>
                  <li>View transaction history</li>
                  <li>Manage personal profile</li>
                </ul>
              </div>
              <div className="access-card admin">
                <h4>👑 Admin Access</h4>
                <ul>
                  <li>Manage all system policies</li>
                  <li>Review and approve claims</li>
                  <li>System analytics and reports</li>
                  <li>Oracle and user management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="connect-section">
          <div className="network-info">
            <div className="network-status">
              <h3>🌐 Network Requirements</h3>
              <div className="network-details">
                <p><strong>Required Network:</strong> {CHAIN_NAME}</p>
                <p><strong>Chain ID:</strong> {CHAIN_ID}</p>
                <p><strong>Status:</strong> {isConnected ? (isOnCorrectNetwork ? '✅ Connected to correct network' : '❌ Wrong network') : '⏳ Not connected'}</p>
              </div>
              
              {isConnected && !isOnCorrectNetwork && (
                <div className="network-warning">
                  <p>⚠️ You're connected to the wrong network</p>
                  <button className="switch-network-btn" onClick={switchToCorrectNetwork}>
                    Switch to {CHAIN_NAME}
                  </button>
                </div>
              )}
              
              <button 
                className="toggle-network-info"
                onClick={() => setShowNetworkInfo(!showNetworkInfo)}
              >
                {showNetworkInfo ? 'Hide' : 'Show'} Network Setup Guide
              </button>
              
              {showNetworkInfo && (
                <div className="network-guide">
                  <h4>🔧 Setup Instructions</h4>
                  <ol>
                    <li>Install MetaMask browser extension</li>
                    <li>Create or import your wallet</li>
                    <li>Add {CHAIN_NAME} network to MetaMask</li>
                    <li>Get test ETH from faucet (for testnets)</li>
                    <li>Connect your wallet to this app</li>
                  </ol>
                  
                  <div className="troubleshooting">
                    <h4>❓ Troubleshooting</h4>
                    <ul>
                      <li><strong>MetaMask not detected:</strong> Install MetaMask extension and refresh page</li>
                      <li><strong>Connection failed:</strong> Check if MetaMask is unlocked</li>
                      <li><strong>Wrong network:</strong> Use the "Switch Network" button above</li>
                      <li><strong>Transaction errors:</strong> Ensure you have enough ETH for gas fees</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            className="connect-wallet-btn" 
            onClick={connectWallet}
            disabled={isConnected && !isOnCorrectNetwork}
          >
            <span className="wallet-icon">🦊</span>
            {isConnected ? 
              (isOnCorrectNetwork ? 'Wallet Connected' : 'Switch Network First') : 
              'Connect MetaMask Wallet'
            }
          </button>
          <p className="connect-note">
            Connect your MetaMask wallet to access the platform
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;