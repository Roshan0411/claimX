import React, { useState } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import ClaimForm from './ClaimForm';
import ClaimList from './ClaimList';
import '../styles/components.css';

const ClaimManager = ({ activeTab, isAdmin }) => {
  const { isConnected } = useWeb3Context();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleClaimSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isConnected) {
    return (
      <div className="info-message">
        <h2>Connect Your Wallet</h2>
        <p>Please connect your wallet to manage claims</p>
      </div>
    );
  }

  if (activeTab === 'submit-claim') {
    return <ClaimForm onClaimSubmitted={handleClaimSubmitted} />;
  }

  return <ClaimList refresh={refreshKey} />;
};

export default ClaimManager;
