import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { useContract } from '../hooks/useContract';
import PolicyCard from './PolicyCard';
import '../styles/components.css';
import { getUserPoliciesFromAPI } from '../services/api';

const PolicyList = ({ refresh }) => {
  const { isConnected, account } = useWeb3Context();
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
      // Try fetching policies directly from the smart contract first
      let data = [];
      try {
        data = await getUserPolicies();
      } catch (err) {
        console.warn('Contract call failed, will try backend API:', err);
      }

      // If contract returned nothing (or on error), fall back to backend API
      if (!data || data.length === 0) {
        if (account) {
          try {
            const apiRes = await getUserPoliciesFromAPI(account);
            if (apiRes && apiRes.success && Array.isArray(apiRes.data)) {
              // backend returns policies with possibly different field names
              data = apiRes.data.map((p) => ({
                policyId: p.policyId || p.policyId?.toString?.() || p.id,
                policyholder: p.policyholder || p.policyholder,
                coverageAmount: p.coverageAmount || p.coverageAmount,
                premium: p.premium || p.premium,
                startDate: p.startDate || p.startDate,
                endDate: p.endDate || p.endDate,
                eventType: p.eventType || p.eventType,
                eventParameters: p.eventParameters || p.eventParameters || p.parametersData,
                isActive: p.isActive,
                claimed: p.claimed,
                claimAmount: p.claimAmount || p.claimAmount
              }));
            }
          } catch (apiErr) {
            console.warn('Backend API also failed to return policies:', apiErr);
          }
        }
      }

      setPolicies(data || []);
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