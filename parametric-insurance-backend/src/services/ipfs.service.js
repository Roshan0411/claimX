const axios = require('axios');
const FormData = require('form-data');

class IPFSService {
  constructor() {
    this.pinataApiKey = process.env.PINATA_API_KEY;
    this.pinataSecretKey = process.env.PINATA_SECRET_API_KEY;
    this.pinataJWT = process.env.PINATA_JWT;
    this.pinataGateway = process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud';
    
    if (!this.pinataApiKey || !this.pinataSecretKey) {
      console.warn('⚠️  Pinata credentials not configured, using mock IPFS service');
    } else {
      console.log('✅ Pinata IPFS service initialized');
    }
  }

  // Test Pinata authentication
  async testAuthentication() {
    try {
      const response = await axios.get('https://api.pinata.cloud/data/testAuthentication', {
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        }
      });
      return response.data;
    } catch (error) {
      console.error('Pinata authentication failed:', error.message);
      throw error;
    }
  }

  // Upload JSON data to Pinata
  async uploadJSON(data, metadata = {}) {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        // Mock response for development
        const mockHash = 'QmMock' + Date.now() + Math.random().toString(36).substr(2, 9);
        console.log('Mock IPFS upload:', mockHash);
        return { IpfsHash: mockHash };
      }

      const pinataMetadata = {
        name: metadata.name || `policy-data-${Date.now()}`,
        keyvalues: {
          type: 'policy-data',
          timestamp: new Date().toISOString(),
          ...metadata.keyvalues
        }
      };

      const pinataOptions = {
        cidVersion: 0,
        customPinPolicy: {
          regions: [
            {
              id: 'FRA1',
              desiredReplicationCount: 1
            }
          ]
        }
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
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretKey
          }
        }
      );

      console.log('✅ JSON uploaded to Pinata:', response.data.IpfsHash);
      return response.data;
    } catch (error) {
      console.error('❌ Error uploading JSON to Pinata:', error.message);
      throw error;
    }
  }

  // Upload file to Pinata
  async uploadFile(fileBuffer, fileName, metadata = {}) {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        // Mock response for development
        const mockHash = 'QmMock' + Date.now() + Math.random().toString(36).substr(2, 9);
        console.log('Mock IPFS file upload:', mockHash);
        return { IpfsHash: mockHash };
      }

      const formData = new FormData();
      formData.append('file', fileBuffer, fileName);

      const pinataMetadata = JSON.stringify({
        name: metadata.name || fileName,
        keyvalues: {
          type: 'file',
          originalName: fileName,
          timestamp: new Date().toISOString(),
          ...metadata.keyvalues
        }
      });

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
          regions: [
            {
              id: 'FRA1',
              desiredReplicationCount: 1
            }
          ]
        }
      });

      formData.append('pinataMetadata', pinataMetadata);
      formData.append('pinataOptions', pinataOptions);

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretKey
          }
        }
      );

      console.log('✅ File uploaded to Pinata:', response.data.IpfsHash);
      return response.data;
    } catch (error) {
      console.error('❌ Error uploading file to Pinata:', error.message);
      throw error;
    }
  }

  // Get data from IPFS using Pinata gateway
  async getData(hash) {
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

      const url = `${this.pinataGateway}/ipfs/${hash}`;
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'Accept': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error fetching data from IPFS:', error.message);
      throw error;
    }
  }

  // Get gateway URL for IPFS hash
  getGatewayURL(hash) {
    if (!hash) return null;
    return `${this.pinataGateway}/ipfs/${hash}`;
  }

  // List pinned files
  async listPinnedFiles(limit = 10) {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        return { rows: [] };
      }

      const response = await axios.get('https://api.pinata.cloud/data/pinList', {
        params: {
          pageLimit: limit,
          pageOffset: 0
        },
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        }
      });

      return response.data;
    } catch (error) {
      console.error('❌ Error listing pinned files:', error.message);
      throw error;
    }
  }

  // Unpin file from Pinata
  async unpinFile(hash) {
    try {
      if (!this.pinataApiKey || !this.pinataSecretKey) {
        console.log('Mock unpin:', hash);
        return { message: 'Mock unpin successful' };
      }

      const response = await axios.delete(`https://api.pinata.cloud/pinning/unpin/${hash}`, {
        headers: {
          'pinata_api_key': this.pinataApiKey,
          'pinata_secret_api_key': this.pinataSecretKey
        }
      });

      console.log('✅ File unpinned from Pinata:', hash);
      return response.data;
    } catch (error) {
      console.error('❌ Error unpinning file:', error.message);
      throw error;
    }
  }
}

module.exports = new IPFSService();