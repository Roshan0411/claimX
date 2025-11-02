import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { useContract } from '../hooks/useContract';
import ClaimCard from './ClaimCard';
import '../styles/components.css';

const ClaimList = ({ refresh }) => {
  const { isConnected, account, contract } = useWeb3Context();
  const { getUserClaims } = useContract();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOracle, setIsOracle] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadClaims();
      checkOracleStatus();
    }
  }, [isConnected, refresh]);

  const loadClaims = async () => {
    try {
      setLoading(true);
      const data = await getUserClaims();
      setClaims(data);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkOracleStatus = async () => {
    try {
      const result = await contract.methods.authorizedOracles(account).call();
      setIsOracle(result);
    } catch (error) {
      console.error('Error checking oracle status:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="info-message">
        Please connect your wallet to view your claims
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading claims...</div>;
  }

  if (claims.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Claims Found</h3>
        <p>Submit a claim for your active policies</p>
      </div>
    );
  }

  return (
    <div className="claim-list-container">
      <h2>My Claims ({claims.length})</h2>
      {isOracle && <span className="badge badge-info">Oracle Access</span>}
      <div className="claim-grid">
        {claims.map((claim) => (
          <ClaimCard
            key={claim.claimId}
            claim={claim}
            onUpdate={loadClaims}
            isOracle={isOracle}
          />
        ))}
      </div>
    </div>
  );
};

export default ClaimList;