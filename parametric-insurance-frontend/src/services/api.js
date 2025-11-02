import axios from 'axios';
import { BACKEND_URL } from '../utils/constants';

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Policy APIs
export const uploadPolicyParameters = async (parameters) => {
  const response = await api.post('/api/policies/upload-parameters', { parameters });
  return response.data;
};

export const getUserPoliciesFromAPI = async (address) => {
  const response = await api.get(`/api/policies/user/${address}`);
  return response.data;
};

export const getPolicyDetailsFromAPI = async (policyId) => {
  const response = await api.get(`/api/policies/${policyId}`);
  return response.data;
};

// Claim APIs
export const uploadClaimEvidence = async (evidence) => {
  const response = await api.post('/api/claims/upload-evidence', { evidence });
  return response.data;
};

export const getUserClaimsFromAPI = async (address) => {
  const response = await api.get(`/api/claims/user/${address}`);
  return response.data;
};

export const getClaimDetailsFromAPI = async (claimId) => {
  const response = await api.get(`/api/claims/${claimId}`);
  return response.data;
};

// Oracle APIs
export const verifyClaimAPI = async (claimId, eventType, eventParameters) => {
  const response = await api.post('/api/oracle/verify-claim', {
    claimId,
    eventType,
    eventParameters,
  });
  return response.data;
};

// User Management APIs
export const getAllUsersAPI = async () => {
  const response = await api.get('/api/users/all');
  return response.data;
};

export const getUserDetailsAPI = async (userId) => {
  const response = await api.get(`/api/users/${userId}/details`);
  return response.data;
};

export const verifyUserAPI = async (userId, verificationData = {}) => {
  const response = await api.post(`/api/users/${userId}/verify`, { verificationData });
  return response.data;
};

export const updateUserStatusAPI = async (userId, status, reason = '') => {
  const response = await api.put(`/api/users/${userId}/status`, { status, reason });
  return response.data;
};

// Admin APIs
export const getAllClaimsAPI = async () => {
  const response = await api.get('/api/admin/claims');
  return response.data;
};

export const approveClaimAPI = async (claimId) => {
  const response = await api.post('/api/admin/approve-claim', { claimId });
  return response.data;
};

export const rejectClaimAPI = async (claimId, reason = '') => {
  const response = await api.post('/api/admin/reject-claim', { claimId, reason });
  return response.data;
};

export const getWeatherData = async (location, date) => {
  const response = await api.get('/api/oracle/weather', {
    params: { location, date },
  });
  return response.data;
};

export const getFlightData = async (flightNumber, date) => {
  const response = await api.get('/api/oracle/flight', {
    params: { flightNumber, date },
  });
  return response.data;
};

export { api };
export default api;