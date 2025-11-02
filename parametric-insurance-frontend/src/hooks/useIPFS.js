import { useState, useCallback, useRef } from 'react';
import { create } from 'ipfs-http-client';

// IPFS client configuration
const IPFS_CONFIG = {
  url: import.meta.env.VITE_IPFS_NODE_URL || 'http://localhost:5001',
  timeout: 60000,
};

const GATEWAY_URL = import.meta.env.VITE_IPFS_GATEWAY_URL || 'http://localhost:8080';

// Custom hook for IPFS operations
export const useIPFS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const clientRef = useRef(null);

  // Initialize IPFS client
  const getClient = useCallback(() => {
    if (!clientRef.current) {
      try {
        clientRef.current = create(IPFS_CONFIG);
      } catch (err) {
        console.error('Failed to create IPFS client:', err);
        setError('Failed to connect to IPFS node');
        return null;
      }
    }
    return clientRef.current;
  }, []);

  // Upload JSON data to IPFS
  const uploadJSON = useCallback(async (data, options = {}) => {
    const client = getClient();
    if (!client) return null;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const jsonString = JSON.stringify(data, null, 2);
      const file = new TextEncoder().encode(jsonString);

      const result = await client.add(file, {
        progress: (bytes) => {
          const percentage = Math.round((bytes / file.length) * 100);
          setProgress(percentage);
        },
        ...options,
      });

      setLoading(false);
      setProgress(100);

      return {
        hash: result.path,
        url: `${GATEWAY_URL}/ipfs/${result.path}`,
        size: result.size,
        type: 'json',
      };
    } catch (err) {
      console.error('IPFS JSON upload failed:', err);
      setError(err.message);
      setLoading(false);
      setProgress(0);
      throw err;
    }
  }, [getClient]);

  // Upload file to IPFS
  const uploadFile = useCallback(async (file, options = {}) => {
    const client = getClient();
    if (!client) return null;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await client.add(file, {
        progress: (bytes) => {
          const percentage = Math.round((bytes / file.size) * 100);
          setProgress(percentage);
        },
        ...options,
      });

      setLoading(false);
      setProgress(100);

      return {
        hash: result.path,
        url: `${GATEWAY_URL}/ipfs/${result.path}`,
        size: result.size,
        type: 'file',
        filename: file.name || 'unknown',
        mimeType: file.type || 'application/octet-stream',
      };
    } catch (err) {
      console.error('IPFS file upload failed:', err);
      setError(err.message);
      setLoading(false);
      setProgress(0);
      throw err;
    }
  }, [getClient]);

  // Upload multiple files to IPFS
  const uploadFiles = useCallback(async (files, options = {}) => {
    const client = getClient();
    if (!client) return null;

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const results = [];
      let totalSize = 0;
      let uploadedSize = 0;

      // Calculate total size
      for (const file of files) {
        totalSize += file.size;
      }

      for (const file of files) {
        const result = await client.add(file, {
          progress: (bytes) => {
            const currentProgress = Math.round(((uploadedSize + bytes) / totalSize) * 100);
            setProgress(currentProgress);
          },
          ...options,
        });

        uploadedSize += file.size;

        results.push({
          hash: result.path,
          url: `${GATEWAY_URL}/ipfs/${result.path}`,
          size: result.size,
          type: 'file',
          filename: file.name || 'unknown',
          mimeType: file.type || 'application/octet-stream',
        });
      }

      setLoading(false);
      setProgress(100);

      return results;
    } catch (err) {
      console.error('IPFS multiple file upload failed:', err);
      setError(err.message);
      setLoading(false);
      setProgress(0);
      throw err;
    }
  }, [getClient]);

  // Retrieve data from IPFS
  const retrieveData = useCallback(async (hash) => {
    const client = getClient();
    if (!client) return null;

    setLoading(true);
    setError(null);

    try {
      const chunks = [];
      for await (const chunk of client.cat(hash)) {
        chunks.push(chunk);
      }

      const data = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        data.set(chunk, offset);
        offset += chunk.length;
      }

      setLoading(false);

      // Try to parse as JSON, otherwise return as text
      try {
        const jsonString = new TextDecoder().decode(data);
        return JSON.parse(jsonString);
      } catch {
        return new TextDecoder().decode(data);
      }
    } catch (err) {
      console.error('IPFS data retrieval failed:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, [getClient]);

  // Pin content to IPFS
  const pinContent = useCallback(async (hash) => {
    const client = getClient();
    if (!client) return false;

    setLoading(true);
    setError(null);

    try {
      await client.pin.add(hash);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('IPFS pinning failed:', err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [getClient]);

  // Unpin content from IPFS
  const unpinContent = useCallback(async (hash) => {
    const client = getClient();
    if (!client) return false;

    setLoading(true);
    setError(null);

    try {
      await client.pin.rm(hash);
      setLoading(false);
      return true;
    } catch (err) {
      console.error('IPFS unpinning failed:', err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [getClient]);

  // Get IPFS node stats
  const getNodeStats = useCallback(async () => {
    const client = getClient();
    if (!client) return null;

    setLoading(true);
    setError(null);

    try {
      const stats = await client.stats.repo();
      setLoading(false);
      return {
        totalSize: stats.repoSize,
        objectCount: stats.numObjects,
        version: stats.version,
      };
    } catch (err) {
      console.error('IPFS stats retrieval failed:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, [getClient]);

  // Check if IPFS node is online
  const checkNodeStatus = useCallback(async () => {
    const client = getClient();
    if (!client) return false;

    try {
      await client.id();
      return true;
    } catch (err) {
      console.error('IPFS node check failed:', err);
      return false;
    }
  }, [getClient]);

  // Generate IPFS gateway URL
  const getGatewayUrl = useCallback((hash) => {
    return `${GATEWAY_URL}/ipfs/${hash}`;
  }, []);

  // Validate IPFS hash
  const isValidHash = useCallback((hash) => {
    if (!hash || typeof hash !== 'string') return false;
    
    // IPFS hashes typically start with 'Qm' (v0) or 'bafy' (v1)
    return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{55})$/.test(hash);
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset progress
  const resetProgress = useCallback(() => {
    setProgress(0);
  }, []);

  return {
    // State
    loading,
    error,
    progress,
    
    // Upload operations
    uploadJSON,
    uploadFile,
    uploadFiles,
    
    // Retrieval operations
    retrieveData,
    
    // Pin operations
    pinContent,
    unpinContent,
    
    // Node operations
    getNodeStats,
    checkNodeStatus,
    
    // Utility functions
    getGatewayUrl,
    isValidHash,
    clearError,
    resetProgress,
  };
};

// Hook for policy data IPFS operations
export const usePolicyIPFS = () => {
  const ipfs = useIPFS();

  const uploadPolicyData = useCallback(async (policyData) => {
    const dataToUpload = {
      type: 'policy',
      version: '1.0',
      data: policyData,
      timestamp: new Date().toISOString(),
    };

    return await ipfs.uploadJSON(dataToUpload);
  }, [ipfs]);

  const retrievePolicyData = useCallback(async (hash) => {
    const data = await ipfs.retrieveData(hash);
    
    if (data && data.type === 'policy') {
      return data;
    }
    
    throw new Error('Invalid policy data format');
  }, [ipfs]);

  return {
    ...ipfs,
    uploadPolicyData,
    retrievePolicyData,
  };
};

// Hook for claim data IPFS operations
export const useClaimIPFS = () => {
  const ipfs = useIPFS();

  const uploadClaimData = useCallback(async (claimData, evidenceFiles = []) => {
    // Upload evidence files first
    let evidenceHashes = [];
    if (evidenceFiles.length > 0) {
      evidenceHashes = await ipfs.uploadFiles(evidenceFiles);
    }

    // Upload claim data with evidence references
    const dataToUpload = {
      type: 'claim',
      version: '1.0',
      data: {
        ...claimData,
        evidence: evidenceHashes,
      },
      timestamp: new Date().toISOString(),
    };

    return await ipfs.uploadJSON(dataToUpload);
  }, [ipfs]);

  const retrieveClaimData = useCallback(async (hash) => {
    const data = await ipfs.retrieveData(hash);
    
    if (data && data.type === 'claim') {
      return data;
    }
    
    throw new Error('Invalid claim data format');
  }, [ipfs]);

  return {
    ...ipfs,
    uploadClaimData,
    retrieveClaimData,
  };
};

// Hook for oracle data IPFS operations
export const useOracleIPFS = () => {
  const ipfs = useIPFS();

  const uploadOracleData = useCallback(async (oracleData) => {
    const dataToUpload = {
      type: 'oracle',
      version: '1.0',
      data: oracleData,
      timestamp: new Date().toISOString(),
    };

    return await ipfs.uploadJSON(dataToUpload);
  }, [ipfs]);

  const retrieveOracleData = useCallback(async (hash) => {
    const data = await ipfs.retrieveData(hash);
    
    if (data && data.type === 'oracle') {
      return data;
    }
    
    throw new Error('Invalid oracle data format');
  }, [ipfs]);

  return {
    ...ipfs,
    uploadOracleData,
    retrieveOracleData,
  };
};

export default useIPFS;