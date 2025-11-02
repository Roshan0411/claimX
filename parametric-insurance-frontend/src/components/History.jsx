import React, { useState } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import '../styles/components.css';

const History = () => {
  const { account } = useWeb3Context();
  const [activeFilter, setActiveFilter] = useState('all');

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

  return (
    <div className="history-container">
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
                    <button className="btn-secondary">View on Explorer</button>
                    <button className="btn-secondary">Download Receipt</button>
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
          <button className="btn-primary">📄 Export to PDF</button>
          <button className="btn-secondary">📊 Export to CSV</button>
          <button className="btn-secondary">📧 Email Report</button>
        </div>
      </div>
    </div>
  );
};

export default History;