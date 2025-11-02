import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { useContract } from '../hooks/useContract';
import { uploadToIPFS } from '../services/ipfsService';
import { toast } from 'react-toastify';
import '../styles/components.css';

const ClaimForm = ({ onClaimSubmitted }) => {
  const { isConnected } = useWeb3Context();
  const { getUserPolicies, submitClaim } = useContract();
  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [evidenceData, setEvidenceData] = useState({
    description: '',
    date: '',
    details: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      loadActivePolicies();
    }
  }, [isConnected]);

  const loadActivePolicies = async () => {
    try {
      const allPolicies = await getUserPolicies();
      const activePolicies = allPolicies.filter(
        (p) => p.isActive && !p.claimed
      );
      setPolicies(activePolicies);
    } catch (error) {
      console.error('Error loading policies:', error);
    }
  };

  const handleChange = (e) => {
    setEvidenceData({
      ...evidenceData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPolicy) {
      toast.error('Please select a policy');
      return;
    }

    try {
      setLoading(true);

      // Upload evidence to IPFS
      const evidence = {
        ...evidenceData,
        policyId: selectedPolicy,
        submittedAt: new Date().toISOString(),
      };

      const ipfsHash = await uploadToIPFS(evidence);
      console.log('Evidence IPFS Hash:', ipfsHash);

      // Submit claim
      await submitClaim(selectedPolicy, ipfsHash);

      // Reset form
      setSelectedPolicy('');
      setEvidenceData({
        description: '',
        date: '',
        details: '',
      });

      if (onClaimSubmitted) {
        onClaimSubmitted();
      }
    } catch (error) {
      console.error('Error submitting claim:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="info-message">
        Please connect your wallet to submit a claim
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="info-message">
        You don't have any active policies to claim
      </div>
    );
  }

  return (
    <div className="claim-form-container">
      <h2>Submit Claim</h2>
      <form onSubmit={handleSubmit} className="claim-form">
        <div className="form-group">
          <label>Select Policy</label>
          <select
            value={selectedPolicy}
            onChange={(e) => setSelectedPolicy(e.target.value)}
            required
          >
            <option value="">-- Select a Policy --</option>
            {policies.map((policy) => (
              <option key={policy.policyId} value={policy.policyId}>
                Policy #{policy.policyId} - {policy.eventType} ({policy.coverageAmount} ETH)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Incident Date</label>
          <input
            type="date"
            name="date"
            value={evidenceData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={evidenceData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe what happened..."
            required
          />
        </div>

        <div className="form-group">
          <label>Additional Details</label>
          <textarea
            name="details"
            value={evidenceData.details}
            onChange={handleChange}
            rows="4"
            placeholder="Provide any additional information or evidence..."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          {loading ? 'Submitting Claim...' : 'Submit Claim'}
        </button>
      </form>
    </div>
  );
};

export default ClaimForm;