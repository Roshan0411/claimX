import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { useContract } from '../hooks/useContract';
import PolicyCard from './PolicyCard';
import '../styles/components.css';

const PolicyList = ({ refresh }) => {
  const { isConnected } = useWeb3Context();
  const { getUserPolicies } = useContract();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isConnected) {
      loadPolicies();
    }
  }, [isConnected, refresh]);

  const loadPolicies = async () => {
    try {
      setLoading(true);
      const data = await getUserPolicies();
      setPolicies(data);
    } catch (error) {
      console.error('Error loading policies:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="info-message">
        Please connect your wallet to view your policies
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading policies...</div>;
  }

  if (policies.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Policies Found</h3>
        <p>Create your first insurance policy to get started</p>
      </div>
    );
  }

  return (
    <div className="policy-list-container">
      <h2>My Policies ({policies.length})</h2>
      <div className="policy-grid">
        {policies.map((policy) => (
          <PolicyCard
            key={policy.policyId}
            policy={policy}
            onUpdate={loadPolicies}
          />
        ))}
      </div>
    </div>
  );
};

export default PolicyList;