import React, { useState } from 'react';
import { useContract } from '../hooks/useContract';
import { useWeb3Context } from '../contexts/Web3Context';
import { uploadToIPFS } from '../services/ipfsService';
import { EVENT_TYPES } from '../utils/constants';
import { toast } from 'react-toastify';
import '../styles/components.css';

const CreatePolicy = ({ onPolicyCreated }) => {
  const { isConnected } = useWeb3Context();
  const { createPolicy } = useContract();

  const [formData, setFormData] = useState({
    coverageAmount: '',
    premium: '',
    durationInDays: '30',
    eventType: 'FLIGHT_DELAY',
    description: '',
  });

  const [eventParameters, setEventParameters] = useState({
    flightNumber: '',
    delayMinutes: '120',
    location: '',
    temperature: '',
    rainfall: '',
    magnitude: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleParameterChange = (e) => {
    setEventParameters({
      ...eventParameters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setLoading(true);

      // Prepare parameters based on event type
      let params = {};
      switch (formData.eventType) {
        case 'FLIGHT_DELAY':
          params = {
            flightNumber: eventParameters.flightNumber,
            delayMinutes: parseInt(eventParameters.delayMinutes),
          };
          break;
        case 'WEATHER':
          params = {
            location: eventParameters.location,
            condition: 'rainfall',
            threshold: parseFloat(eventParameters.rainfall),
          };
          break;
        case 'EARTHQUAKE':
          params = {
            location: eventParameters.location,
            magnitudeThreshold: parseFloat(eventParameters.magnitude),
          };
          break;
        default:
          params = {};
      }

      // Upload to IPFS
      const parametersData = {
        ...params,
        description: formData.description,
        createdAt: new Date().toISOString(),
      };

      const ipfsHash = await uploadToIPFS(parametersData);
      console.log('IPFS Hash:', ipfsHash);

      // Create policy on blockchain
      await createPolicy(
        formData.coverageAmount,
        formData.premium,
        parseInt(formData.durationInDays),
        formData.eventType,
        ipfsHash
      );

      // Reset form
      setFormData({
        coverageAmount: '',
        premium: '',
        durationInDays: '30',
        eventType: 'FLIGHT_DELAY',
        description: '',
      });

      setEventParameters({
        flightNumber: '',
        delayMinutes: '120',
        location: '',
        temperature: '',
        rainfall: '',
        magnitude: '',
      });

      if (onPolicyCreated) {
        onPolicyCreated();
      }
    } catch (error) {
      console.error('Error creating policy:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEventParameters = () => {
    switch (formData.eventType) {
      case 'FLIGHT_DELAY':
        return (
          <>
            <div className="form-group">
              <label>Flight Number</label>
              <input
                type="text"
                name="flightNumber"
                value={eventParameters.flightNumber}
                onChange={handleParameterChange}
                placeholder="e.g., AA123"
                required
              />
            </div>
            <div className="form-group">
              <label>Delay Threshold (minutes)</label>
              <input
                type="number"
                name="delayMinutes"
                value={eventParameters.delayMinutes}
                onChange={handleParameterChange}
                min="1"
                required
              />
            </div>
          </>
        );

      case 'WEATHER':
        return (
          <>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={eventParameters.location}
                onChange={handleParameterChange}
                placeholder="City name"
                required
              />
            </div>
            <div className="form-group">
              <label>Rainfall Threshold (mm)</label>
              <input
                type="number"
                name="rainfall"
                value={eventParameters.rainfall}
                onChange={handleParameterChange}
                step="0.1"
                min="0"
                required
              />
            </div>
          </>
        );

      case 'EARTHQUAKE':
        return (
          <>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={eventParameters.location}
                onChange={handleParameterChange}
                placeholder="City/Region"
                required
              />
            </div>
            <div className="form-group">
              <label>Magnitude Threshold</label>
              <input
                type="number"
                name="magnitude"
                value={eventParameters.magnitude}
                onChange={handleParameterChange}
                step="0.1"
                min="0"
                max="10"
                required
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-policy-container">
      <h2>Create New Policy</h2>
      <form onSubmit={handleSubmit} className="policy-form">
        <div className="form-row">
          <div className="form-group">
            <label>Coverage Amount (ETH)</label>
            <input
              type="number"
              name="coverageAmount"
              value={formData.coverageAmount}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              required
              placeholder="e.g., 1.0"
            />
          </div>

          <div className="form-group">
            <label>Premium (ETH)</label>
            <input
              type="number"
              name="premium"
              value={formData.premium}
              onChange={handleChange}
              step="0.001"
              min="0.001"
              required
              placeholder="e.g., 0.1"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Duration (Days)</label>
            <input
              type="number"
              name="durationInDays"
              value={formData.durationInDays}
              onChange={handleChange}
              min="1"
              max="365"
              required
            />
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              required
            >
              {EVENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {renderEventParameters()}

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Additional policy details..."
          />
        </div>

        <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
          {loading ? 'Creating Policy...' : 'Create Policy'}
        </button>
      </form>
    </div>
  );
};

export default CreatePolicy;