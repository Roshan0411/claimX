import React, { useState } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import TransactionUtils from '../utils/transactionUtils';
import '../styles/components.css';

const History = () => {
  const { account } = useWeb3Context();
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Show notification to user
  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(''), 3000);
  };

  const [transactions] = useState([
    {
      id: 'TXN001',
      type: 'policy_creation',
      description: 'Created Flight Insurance Policy #POL001',
      amount: '0.5 ETH',
      date: '2025-10-01',
      txHash: '0x1234567890abcdef...',
      status: 'Completed'
    },
    {
      id: 'TXN002',
      type: 'claim_submission',
      description: 'Submitted Claim #CLM001 for Flight Delay',
      amount: '2.5 ETH',
      date: '2025-10-14',
      txHash: '0xabcdef1234567890...',
      status: 'Pending'
    },
    {
      id: 'TXN003',
      type: 'payout',
      description: 'Received Payout for Claim #CLM002',
      amount: '5.0 ETH',
      date: '2025-10-13',
      txHash: '0x9876543210fedcba...',
      status: 'Completed'
    },
    {
      id: 'TXN004',
      type: 'policy_creation',
      description: 'Created Weather Insurance Policy #POL002',
      amount: '1.2 ETH',
      date: '2025-09-15',
      txHash: '0xfedcba0987654321...',
      status: 'Completed'
    },
    {
      id: 'TXN005',
      type: 'premium_payment',
      description: 'Premium Payment for Policy #POL003',
      amount: '5.0 ETH',
      date: '2025-06-01',
      txHash: '0x1111222233334444...',
      status: 'Completed'
    }
  ]);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'policy_creation': return '📄';
      case 'claim_submission': return '📝';
      case 'payout': return '💰';
      case 'premium_payment': return '💳';
      default: return '🔄';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'policy_creation': return 'blue';
      case 'claim_submission': return 'orange';
      case 'payout': return 'green';
      case 'premium_payment': return 'purple';
      default: return 'gray';
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (activeFilter === 'all') return true;
    return tx.type === activeFilter;
  });

  // Handle View on Explorer button
  const handleViewOnExplorer = (txHash) => {
    try {
      TransactionUtils.viewOnExplorer(txHash, 11155111); // Sepolia testnet
      showNotification('Opening transaction in blockchain explorer...');
    } catch (error) {
      showNotification('Failed to open explorer link', true);
    }
  };

  // Handle Download Receipt button
  const handleDownloadReceipt = async (transaction) => {
    try {
      setLoading(true);
      await TransactionUtils.downloadReceipt(transaction, account);
      showNotification('Receipt downloaded successfully!');
    } catch (error) {
      showNotification(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Handle Export to PDF button
  const handleExportToPDF = async () => {
    try {
      setLoading(true);
      await TransactionUtils.exportToPDF(filteredTransactions, account, activeFilter);
      showNotification('Transaction history exported to PDF!');
    } catch (error) {
      showNotification(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Handle Export to CSV button
  const handleExportToCSV = async () => {
    try {
      setLoading(true);
      await TransactionUtils.exportToCSV(filteredTransactions, account, activeFilter);
      showNotification('Transaction history exported to CSV!');
    } catch (error) {
      showNotification(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Report button
  const handleEmailReport = async () => {
    const email = prompt('Enter your email address to receive the transaction history report:');
    
    if (!email) {
      return; // User cancelled
    }
    
    if (!TransactionUtils.isValidEmail(email)) {
      showNotification('Please enter a valid email address', true);
      return;
    }

    try {
      setLoading(true);
      const result = await TransactionUtils.emailReport(filteredTransactions, account, email, activeFilter);
      showNotification(result.message);
    } catch (error) {
      showNotification(error.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-container">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Processing...</p>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.isError ? 'error' : 'success'}`}>
          {notification.message}
        </div>
      )}

      <div className="history-header">
        <h1>Transaction History</h1>
        <p>Account: {account?.substring(0, 6)}...{account?.substring(38)}</p>
      </div>

      <div className="history-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Transactions
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'policy_creation' ? 'active' : ''}`}
          onClick={() => setActiveFilter('policy_creation')}
        >
          📄 Policies
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'claim_submission' ? 'active' : ''}`}
          onClick={() => setActiveFilter('claim_submission')}
        >
          📝 Claims
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'payout' ? 'active' : ''}`}
          onClick={() => setActiveFilter('payout')}
        >
          💰 Payouts
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'premium_payment' ? 'active' : ''}`}
          onClick={() => setActiveFilter('premium_payment')}
        >
          💳 Payments
        </button>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <h3>Total Transactions</h3>
          <p>{transactions.length}</p>
        </div>
        <div className="stat-card">
          <h3>Total Premium Paid</h3>
          <p>6.7 ETH</p>
        </div>
        <div className="stat-card">
          <h3>Total Payouts Received</h3>
          <p>5.0 ETH</p>
        </div>
        <div className="stat-card">
          <h3>Net Activity</h3>
          <p className="negative">-1.7 ETH</p>
        </div>
      </div>

      <div className="history-timeline">
        <h2>Transaction Timeline</h2>
        <div className="timeline-container">
          {filteredTransactions.map((transaction, index) => (
            <div key={transaction.id} className="timeline-item">
              <div className={`timeline-marker ${getTransactionColor(transaction.type)}`}>
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="timeline-content">
                <div className="transaction-card">
                  <div className="transaction-header">
                    <h3>{transaction.description}</h3>
                    <span className={`transaction-status ${transaction.status.toLowerCase()}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="transaction-details">
                    <div className="detail-row">
                      <span className="label">Amount:</span>
                      <span className={`amount ${transaction.type === 'payout' ? 'positive' : 'negative'}`}>
                        {transaction.type === 'payout' ? '+' : '-'}{transaction.amount}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date:</span>
                      <span>{transaction.date}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Transaction Hash:</span>
                      <span className="tx-hash">{transaction.txHash}</span>
                    </div>
                  </div>
                  <div className="transaction-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => handleViewOnExplorer(transaction.txHash)}
                      disabled={loading}
                    >
                      View on Explorer
                    </button>
                    <button 
                      className="btn-secondary"
                      onClick={() => handleDownloadReceipt(transaction)}
                      disabled={loading}
                    >
                      Download Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="export-section">
        <h2>Export Options</h2>
        <div className="export-buttons">
          <button 
            className="btn-primary"
            onClick={handleExportToPDF}
            disabled={loading || filteredTransactions.length === 0}
          >
            📄 Export to PDF
          </button>
          <button 
            className="btn-secondary"
            onClick={handleExportToCSV}
            disabled={loading || filteredTransactions.length === 0}
          >
            📊 Export to CSV
          </button>
          <button 
            className="btn-secondary"
            onClick={handleEmailReport}
            disabled={loading || filteredTransactions.length === 0}
          >
            📧 Email Report
          </button>
        </div>
        {filteredTransactions.length === 0 && (
          <p className="export-notice">No transactions to export with current filter</p>
        )}
      </div>
    </div>
  );
};

export default History;