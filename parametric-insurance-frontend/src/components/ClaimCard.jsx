import React, { useState } from 'react';
import { CLAIM_STATUS } from '../utils/constants';
import { format } from 'date-fns';
import { FaCheckCircle, FaTimesCircle, FaClock, FaMoneyBillWave } from 'react-icons/fa';
import { useContract } from '../hooks/useContract';
import '../styles/components.css';

const ClaimCard = ({ claim, onUpdate, isOracle }) => {
  const { processPayout, approveClaim, rejectClaim } = useContract();
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getStatusIcon = () => {
    switch (claim.status) {
      case '0': // Pending
        return <FaClock className="icon-pending" />;
      case '1': // Approved
        return <FaCheckCircle className="icon-success" />;
      case '2': // Rejected
        return <FaTimesCircle className="icon-danger" />;
      case '3': // Paid
        return <FaMoneyBillWave className="icon-success" />;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    const status = CLAIM_STATUS[claim.status];
    const badgeClass = {
      Pending: 'badge-warning',
      Approved: 'badge-info',
      Rejected: 'badge-danger',
      Paid: 'badge-success',
    }[status];

    return <span className={`badge ${badgeClass}`}>{status}</span>;
  };

  const handleProcessPayout = async () => {
    try {
      setLoading(true);
      await processPayout(claim.claimId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error processing payout:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaim = async () => {
    try {
      setLoading(true);
      await approveClaim(claim.claimId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error approving claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectClaim = async () => {
    if (window.confirm('Are you sure you want to reject this claim?')) {
      try {
        setLoading(true);
        await rejectClaim(claim.claimId);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error rejecting claim:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="claim-card">
      <div className="claim-header">
        <div className="claim-id">
          {getStatusIcon()}
          <h3>Claim #{claim.claimId}</h3>
          {getStatusBadge()}
        </div>
      </div>

      <div className="claim-body">
        <div className="claim-info-grid">
          <div className="info-item">
            <label>Policy ID</label>
            <p className="value">#{claim.policyId}</p>
          </div>
          <div className="info-item">
            <label>Claim Amount</label>
            <p className="value highlight">{claim.claimAmount} ETH</p>
          </div>
          <div className="info-item">
            <label>Claim Date</label>
            <p className="value">
              {format(new Date(Number(claim.claimDate) * 1000), 'PPpp')}
            </p>
          </div>
          <div className="info-item">
            <label>Claimant</label>
            <p className="value small">{claim.claimant}</p>
          </div>
        </div>

        {showDetails && (
          <div className="claim-details">
            <h4>Evidence Details</h4>
            <p><strong>IPFS Hash:</strong> {claim.eventDataHash}</p>
            <a
              href={`https://ipfs.io/ipfs/${claim.eventDataHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-link"
            >
              View Evidence on IPFS
            </a>
          </div>
        )}
      </div>

      <div className="claim-footer">
        <button
          className="btn btn-secondary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '▲ Hide Details' : '▼ View Details'}
        </button>

        {isOracle && claim.status === '0' && (
          <div className="claim-actions">
            <button
              className="btn btn-success"
              onClick={handleApproveClaim}
              disabled={loading}
            >
              {loading ? 'Processing...' : <><FaCheckCircle /> Approve</>}
            </button>
            <button
              className="btn btn-danger"
              onClick={handleRejectClaim}
              disabled={loading}
            >
              <FaTimesCircle /> Reject
            </button>
          </div>
        )}

        {claim.status === '1' && !isOracle && (
          <button
            className="btn btn-primary"
            onClick={handleProcessPayout}
            disabled={loading}
          >
            {loading ? 'Processing...' : <><FaMoneyBillWave /> Process Payout</>}
          </button>
        )}
      </div>
    </div>
  );
};

export default ClaimCard;