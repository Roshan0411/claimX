import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import { FaFileContract, FaClipboardList, FaCoins, FaDollarSign } from 'react-icons/fa';
import '../styles/components.css';

const Stats = () => {
  const { getContractStats } = useContract();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getContractStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading statistics...</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="stats-container">
      <h2>Platform Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaFileContract />
          </div>
          <div className="stat-info">
            <h3>Total Policies</h3>
            <p className="stat-value">{stats.totalPolicies}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <h3>Total Claims</h3>
            <p className="stat-value">{stats.totalClaims}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FaCoins />
          </div>
          <div className="stat-info">
            <h3>Pool Balance</h3>
            <p className="stat-value">{parseFloat(stats.poolBalance).toFixed(4)} ETH</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Premium Collected</h3>
            <p className="stat-value">{parseFloat(stats.premiumCollected).toFixed(4)} ETH</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FaDollarSign />
          </div>
          <div className="stat-info">
            <h3>Claims Paid</h3>
            <p className="stat-value">{parseFloat(stats.claimsPaid).toFixed(4)} ETH</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;