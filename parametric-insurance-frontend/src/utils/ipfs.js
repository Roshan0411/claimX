// IPFS utilities and helpers
import { create } from 'ipfs-http-client';
import { IPFS_CONFIG } from './constants';

class IPFSUtil {
  constructor() {
    this.client = null;
    this.isInitialized = false;
    this.gateways = [
      'https://ipfs.io/ipfs/',
      'https://gateway.ipfs.io/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/',
      'https://dweb.link/ipfs/'
    ];
  }

  // Initialize IPFS client
  async initialize() {
    try {
      this.client = create({
        host: IPFS_CONFIG.host || 'localhost',
        port: IPFS_CONFIG.port || 5001,
        protocol: IPFS_CONFIG.protocol || 'http',
        timeout: IPFS_CONFIG.timeout || 30000,
      });

      // Test connection
      await this.client.id();
      this.isInitialized = true;
      console.log('IPFS client initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize IPFS client:', error);
      this.isInitialized = false;
    }
  }

  // Check if IPFS is available
  isAvailable() {
    return this.isInitialized && this.client;
  }

  // Upload single file to IPFS
  async uploadFile(file) {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      // Validate file
      this.validateFile(file);

      // Convert file to buffer
      const buffer = await this.fileToArrayBuffer(file);

      // Upload to IPFS
      const result = await this.client.add(buffer, {
        pin: true,
        progress: (bytes) => {
          console.log(`Upload progress: ${bytes} bytes`);
        }
      });

      const hash = result.cid.toString();

      return {
        hash,
        size: result.size,
        path: result.path,
        url: this.getGatewayUrl(hash),
        metadata: {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
          uploadedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('IPFS upload error:', error);
      throw new Error(`Failed to upload to IPFS: ${error.message}`);
    }
  }

  // Upload multiple files to IPFS
  async uploadFiles(files) {
    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        const result = await this.uploadFile(file);
        results.push(result);
      } catch (error) {
        errors.push({
          file: file.name,
          error: error.message
        });
      }
    }

    return { results, errors };
  }

  // Upload JSON data to IPFS
  async uploadJSON(data) {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      const jsonString = JSON.stringify(data, null, 2);
      const buffer = new TextEncoder().encode(jsonString);

      const result = await this.client.add(buffer, {
        pin: true
      });

      const hash = result.cid.toString();

      return {
        hash,
        size: result.size,
        path: result.path,
        url: this.getGatewayUrl(hash),
        metadata: {
          type: 'application/json',
          size: buffer.length,
          uploadedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('IPFS JSON upload error:', error);
      throw new Error(`Failed to upload JSON to IPFS: ${error.message}`);
    }
  }

  // Get file from IPFS
  async getFile(hash) {
    if (!this.isAvailable()) {
      // Fallback to gateway
      return this.getFileFromGateway(hash);
    }

    try {
      const chunks = [];
      for await (const chunk of this.client.cat(hash)) {
        chunks.push(chunk);
      }

      const buffer = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }

      return {
        data: buffer,
        hash,
        url: this.getGatewayUrl(hash)
      };
    } catch (error) {
      console.error('IPFS get error:', error);
      // Fallback to gateway
      return this.getFileFromGateway(hash);
    }
  }

  // Get JSON data from IPFS
  async getJSON(hash) {
    try {
      const result = await this.getFile(hash);
      const jsonString = new TextDecoder().decode(result.data);
      const data = JSON.parse(jsonString);

      return {
        data,
        hash,
        url: result.url
      };
    } catch (error) {
      console.error('IPFS JSON get error:', error);
      throw new Error(`Failed to retrieve JSON from IPFS: ${error.message}`);
    }
  }

  // Get file from IPFS gateway (fallback method)
  async getFileFromGateway(hash, gatewayIndex = 0) {
    if (gatewayIndex >= this.gateways.length) {
      throw new Error('All IPFS gateways failed');
    }

    try {
      const url = this.getGatewayUrl(hash, gatewayIndex);
      const response = await fetch(url, {
        method: 'GET',
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = new Uint8Array(await response.arrayBuffer());

      return {
        data,
        hash,
        url
      };
    } catch (error) {
      console.warn(`Gateway ${this.gateways[gatewayIndex]} failed:`, error);
      return this.getFileFromGateway(hash, gatewayIndex + 1);
    }
  }

  // Pin content to IPFS
  async pinContent(hash) {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      await this.client.pin.add(hash);
      return true;
    } catch (error) {
      console.error('IPFS pin error:', error);
      throw new Error(`Failed to pin content: ${error.message}`);
    }
  }

  // Unpin content from IPFS
  async unpinContent(hash) {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      await this.client.pin.rm(hash);
      return true;
    } catch (error) {
      console.error('IPFS unpin error:', error);
      throw new Error(`Failed to unpin content: ${error.message}`);
    }
  }

  // List pinned content
  async listPinned() {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      const pinned = [];
      for await (const pin of this.client.pin.ls()) {
        pinned.push({
          hash: pin.cid.toString(),
          type: pin.type
        });
      }
      return pinned;
    } catch (error) {
      console.error('IPFS list pinned error:', error);
      throw new Error(`Failed to list pinned content: ${error.message}`);
    }
  }

  // Get IPFS node info
  async getNodeInfo() {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      const id = await this.client.id();
      const version = await this.client.version();

      return {
        id: id.id,
        agentVersion: id.agentVersion,
        protocolVersion: id.protocolVersion,
        publicKey: id.publicKey,
        addresses: id.addresses,
        version: version.version,
        commit: version.commit
      };
    } catch (error) {
      console.error('IPFS node info error:', error);
      throw new Error(`Failed to get node info: ${error.message}`);
    }
  }

  // Utility methods
  getGatewayUrl(hash, gatewayIndex = 0) {
    return `${this.gateways[gatewayIndex]}${hash}`;
  }

  validateFile(file) {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/json',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (file.size > maxSize) {
      throw new Error(`File size exceeds maximum limit of ${this.formatSize(maxSize)}`);
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`);
    }
  }

  async fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(new Uint8Array(reader.result));
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsArrayBuffer(file);
    });
  }

  formatSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  }

  // Generate shareable link with metadata
  generateShareableLink(hash, filename = null, download = false) {
    const baseUrl = this.getGatewayUrl(hash);
    const params = new URLSearchParams();

    if (filename) {
      params.set('filename', filename);
    }

    if (download) {
      params.set('download', 'true');
    }

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }

  // Create IPFS directory
  async createDirectory(files) {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      const filesToAdd = [];

      for (const file of files) {
        const buffer = await this.fileToArrayBuffer(file);
        filesToAdd.push({
          path: file.name,
          content: buffer
        });
      }

      const results = [];
      for await (const result of this.client.addAll(filesToAdd, { pin: true })) {
        results.push({
          path: result.path,
          hash: result.cid.toString(),
          size: result.size
        });
      }

      // The last result is the directory hash
      const directoryResult = results[results.length - 1];

      return {
        directoryHash: directoryResult.hash,
        files: results.slice(0, -1),
        url: this.getGatewayUrl(directoryResult.hash)
      };
    } catch (error) {
      console.error('IPFS directory creation error:', error);
      throw new Error(`Failed to create IPFS directory: ${error.message}`);
    }
  }

  // Search for content by hash pattern
  async findContent(hashPattern) {
    if (!this.isAvailable()) {
      throw new Error('IPFS client not available');
    }

    try {
      const pinned = await this.listPinned();
      return pinned.filter(item => 
        item.hash.toLowerCase().includes(hashPattern.toLowerCase())
      );
    } catch (error) {
      console.error('IPFS search error:', error);
      throw new Error(`Failed to search content: ${error.message}`);
    }
  }

  // Batch operations
  async batchPin(hashes) {
    const results = [];
    const errors = [];

    for (const hash of hashes) {
      try {
        await this.pinContent(hash);
        results.push({ hash, status: 'pinned' });
      } catch (error) {
        errors.push({ hash, error: error.message });
      }
    }

    return { results, errors };
  }

  async batchUnpin(hashes) {
    const results = [];
    const errors = [];

    for (const hash of hashes) {
      try {
        await this.unpinContent(hash);
        results.push({ hash, status: 'unpinned' });
      } catch (error) {
        errors.push({ hash, error: error.message });
      }
    }

    return { results, errors };
  }
}

// Export singleton instance
export const ipfsUtil = new IPFSUtil();

// Export utility functions
export const ipfsUtils = {
  // Validate IPFS hash
  isValidHash: (hash) => {
    const patterns = [
      /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/, // v0 hash
      /^baf[a-z0-9]{56}$/, // v1 hash (base32)
      /^k[a-z0-9]{50,59}$/ // other CID formats
    ];
    return patterns.some(pattern => pattern.test(hash));
  },

  // Format hash for display
  formatHash: (hash) => {
    if (!hash) return '';
    if (hash.length <= 16) return hash;
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  },

  // Extract hash from URL
  extractHashFromUrl: (url) => {
    const match = url.match(/\/(Qm[1-9A-HJ-NP-Za-km-z]{44}|baf[a-z0-9]{56}|k[a-z0-9]{50,59})(?:\/|$)/);
    return match ? match[1] : null;
  },

  // Get file extension from IPFS path
  getFileExtension: (path) => {
    const lastDot = path.lastIndexOf('.');
    return lastDot !== -1 ? path.slice(lastDot + 1).toLowerCase() : '';
  },

  // Estimate upload time
  estimateUploadTime: (fileSize, uploadSpeed = 1024 * 1024) => {
    const seconds = fileSize / uploadSpeed;

    if (seconds < 60) {
      return `${Math.round(seconds)} seconds`;
    } else if (seconds < 3600) {
      return `${Math.round(seconds / 60)} minutes`;
    } else {
      return `${Math.round(seconds / 3600)} hours`;
    }
  },

  // Create metadata object
  createMetadata: (file, additionalData = {}) => {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      uploadedAt: new Date().toISOString(),
      ...additionalData
    };
  },

  // Validate file type for insurance documents
  isValidInsuranceDocument: (file) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return allowedTypes.includes(file.type);
  },

  // Generate content addressing
  generateContentAddress: (content) => {
    // This would typically use a hash function like SHA-256
    // For now, we'll use a simple implementation
    return btoa(content).replace(/[+/=]/g, '').substring(0, 46);
  }
};

// Initialize IPFS on module load
ipfsUtil.initialize().catch(console.warn);

export default ipfsUtil;