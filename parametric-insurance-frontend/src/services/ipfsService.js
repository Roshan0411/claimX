import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.REACT_APP_PINATA_SECRET_API_KEY;
const PINATA_JWT = process.env.REACT_APP_PINATA_JWT;
const PINATA_GATEWAY = process.env.REACT_APP_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

// Upload JSON data to Pinata
export const uploadToIPFS = async (data) => {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      // Mock response for development
      const mockHash = 'QmMock' + Date.now() + Math.random().toString(36).substr(2, 9);
      console.log('Mock IPFS upload:', mockHash);
      return mockHash;
    }

    const pinataMetadata = {
      name: `frontend-data-${Date.now()}`,
      keyvalues: {
        type: 'frontend-data',
        timestamp: new Date().toISOString()
      }
    };

    const pinataOptions = {
      cidVersion: 0
    };

    const requestData = {
      pinataContent: data,
      pinataMetadata,
      pinataOptions
    };

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      requestData,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      }
    );

    console.log('✅ Data uploaded to Pinata:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('❌ Error uploading to Pinata:', error);
    throw error;
  }
};

// Upload file to Pinata
export const uploadFileToIPFS = async (file) => {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      // Mock response for development
      const mockHash = 'QmMock' + Date.now() + Math.random().toString(36).substr(2, 9);
      console.log('Mock file upload:', mockHash);
      return mockHash;
    }

    const formData = new FormData();
    formData.append('file', file);

    const pinataMetadata = JSON.stringify({
      name: file.name || `file-${Date.now()}`,
      keyvalues: {
        type: 'file',
        originalName: file.name,
        timestamp: new Date().toISOString()
      }
    });

    const pinataOptions = JSON.stringify({
      cidVersion: 0
    });

    formData.append('pinataMetadata', pinataMetadata);
    formData.append('pinataOptions', pinataOptions);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
      }
    );

    console.log('✅ File uploaded to Pinata:', response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error('❌ Error uploading file to Pinata:', error);
    throw error;
  }
};

// Get data from IPFS using Pinata gateway
export const getFromIPFS = async (hash) => {
  try {
    if (!hash) {
      throw new Error('IPFS hash is required');
    }

    if (hash.startsWith('QmMock')) {
      // Return mock data for development
      return {
        message: 'Mock IPFS data',
        hash: hash,
        timestamp: new Date().toISOString()
      };
    }

    const url = `${PINATA_GATEWAY}/ipfs/${hash}`;
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'Accept': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('❌ Error fetching from IPFS:', error);
    throw error;
  }
};

// Get IPFS gateway URL
export const getIPFSUrl = (hash) => {
  if (!hash) return null;
  return `${PINATA_GATEWAY}/ipfs/${hash}`;
};

// Test Pinata authentication (for debugging)
export const testPinataAuth = async () => {
  try {
    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return { authenticated: false, message: 'API keys not configured' };
    }

    const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_SECRET_API_KEY
      }
    });

    return { authenticated: true, data: response.data };
  } catch (error) {
    console.error('Pinata authentication failed:', error);
    return { authenticated: false, error: error.message };
  }
};