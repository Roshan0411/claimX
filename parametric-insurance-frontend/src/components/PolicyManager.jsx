import React, { useState } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import CreatePolicy from './CreatePolicy';
import PolicyList from './PolicyList';
import '../styles/components.css';

const PolicyManager = ({ activeTab, isAdmin }) => {
  const { isConnected } = useWeb3Context();
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePolicyCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!isConnected) {
    return (
      <div className="info-message">
        <h2>Connect Your Wallet</h2>
        <p>Please connect your wallet to manage policies</p>
      </div>
    );
  }

  if (activeTab === 'create-policy') {
    return <CreatePolicy onPolicyCreated={handlePolicyCreated} />;
  }

  return <PolicyList refresh={refreshKey} />;
};

export default PolicyManager;
