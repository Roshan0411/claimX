import React from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import '../styles/components.css';

const Navbar = ({ onLogout, userRole }) => {
  const { account, isConnected, connectWallet, disconnectWallet, chainId } = useWeb3Context();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const handleLogout = () => {
    disconnectWallet();
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          🛡️ Parametric Insurance
        </div>
        
        <div className="wallet-section">
          {isConnected ? (
            <>
              <div className="wallet-info">
                <div className="user-role-badge">
                  {userRole === 'admin' ? '👑 Admin' : '👤 User'}
                </div>
                <span>{formatAddress(account)}</span>
                {chainId && (
                  <span className="chain-info">
                    {chainId === 11155111 ? 'Sepolia' : 'Wrong Network'}
                  </span>
                )}
              </div>
              <button
                className="wallet-button logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="wallet-button"
              onClick={connectWallet}
            >
              💼 Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;