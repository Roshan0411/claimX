// Simple IPFS configuration - using public gateway for now
// For production, configure with your IPFS provider
const axios = require('axios');
require('dotenv').config();

// IPFS HTTP client alternative using axios
const ipfsClient = {
  add: async (data) => {
    // For now, return a mock hash - replace with actual IPFS implementation
    console.log('IPFS add called - using mock implementation');
    return { path: 'QmMockHash' + Date.now() };
  },
  
  get: async (hash) => {
    // For now, return mock data - replace with actual IPFS implementation
    console.log('IPFS get called for hash:', hash);
    return 'Mock IPFS data for ' + hash;
  }
};

module.exports = ipfsClient;