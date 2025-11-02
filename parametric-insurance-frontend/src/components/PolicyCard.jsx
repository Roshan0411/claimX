import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { format } from 'date-fns';
import { FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import '../styles/components.css';

const PolicyCard = ({ policy, onUpdate }) => {
  const { payPremium, cancelPolicy } = useContract();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handlePayPremium = async () => {
    try {
      setLoading(true);
      await payPremium(policy.policyId, policy.premium);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error paying premium:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPolicy = async () => {
    if (window.confirm('Are you sure you want to cancel this policy?')) {
      try {
        setLoading(true);
        await cancelPolicy(policy.policyId);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error cancelling policy:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = () => {
    if (policy.claimed) {
      return <span className="badge badge-success">Claimed</span>;
    } else if (policy.isActive) {
      return <span className="badge badge-info">Active</span>;
    } else {
      return <span className="badge badge-warning">Inactive</span>;
    }
  };

  return (
    <div className="policy-card">
      <div className="policy-header">
        <div className="policy-id">
          <h3>Policy #{policy.policyId}</h3>
          {getStatusBadge()}
        </div>
        <div className="policy-type">
          <span className="event-type">{policy.eventType}</span>
        </div>
      </div>

      <div className="policy-body">
        <div className="policy-info-grid">
          <div className="info-item">
            <label>Coverage Amount</label>
            <p className="value highlight">{policy.coverageAmount} ETH</p>
          </div>
          <div className="info-item">
            <label>Premium</label>
            <p className="value">{policy.premium} ETH</p>
          </div>
          {policy.isActive && (
            <>
              <div className="info-item">
                <label>Start Date</label>
                <p className="value">
                  {format(new Date(Number(policy.startDate) * 1000), 'PP')}
                </p>
              </div>
              <div className="info-item">
                <label>End Date</label>
                <p className="value">
                  {format(new Date(Number(policy.endDate) * 1000), 'PP')}
                </p>
              </div>
            </>
          )}
        </div>

        {showDetails && (
          <div className="policy-details">
            <h4>Policy Details</h4>
            <p><strong>IPFS Hash:</strong> {policy.eventParameters}</p>
            <p><strong>Policyholder:</strong> {policy.policyholder}</p>
            {policy.claimed && policy.claimAmount > 0 && (
              <p><strong>Claim Amount:</strong> {policy.claimAmount} ETH</p>
            )}
          </div>
        )}
      </div>

      <div className="policy-footer">
        <button
          className="btn btn-secondary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▲ Hide Details' : '▼ View Details'}
        </button>

        {!policy.isActive && !policy.claimed && (
          <div className="policy-actions">
            <button
              className="btn btn-primary"
              onClick={handlePayPremium}
              disabled={loading}
            >
              {loading ? 'Processing...' : <><FaMoneyBillWave /> Pay Premium</>}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleCancelPolicy}
              disabled={loading}
            >
              <FaTimesCircle /> Cancel
            </button>
          </div>
        )}

        {policy.isActive && !policy.claimed && (
          <div className="info-badge">
            <span className="badge badge-success">✓ Premium Paid - Active Coverage</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;