// Smart contract utilities and helpers
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, CONTRACT_ABIS, NETWORK_CONFIG } from './constants';

class ContractService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contracts = {};
  }

  // Initialize provider and signer
  async initialize(provider) {
    if (!provider) {
      throw new Error('Provider is required');
    }

    this.provider = provider;
    this.signer = provider.getSigner();
    
    // Initialize contracts
    await this.initializeContracts();
  }

  // Initialize all contracts
  async initializeContracts() {
    const network = await this.provider.getNetwork();
    const chainId = network.chainId;

    if (!CONTRACT_ADDRESSES[chainId]) {
      throw new Error(`Contracts not deployed on network ${chainId}`);
    }

    const addresses = CONTRACT_ADDRESSES[chainId];
    const abis = CONTRACT_ABIS;

    // Initialize main insurance contract
    this.contracts.insurance = new ethers.Contract(
      addresses.INSURANCE_CONTRACT,
      abis.INSURANCE_ABI,
      this.signer
    );

    // Initialize oracle contract
    this.contracts.oracle = new ethers.Contract(
      addresses.ORACLE_CONTRACT,
      abis.ORACLE_ABI,
      this.signer
    );

    // Initialize token contract (if using ERC20)
    if (addresses.TOKEN_CONTRACT) {
      this.contracts.token = new ethers.Contract(
        addresses.TOKEN_CONTRACT,
        abis.TOKEN_ABI,
        this.signer
      );
    }
  }

  // Policy Management
  async createPolicy(policyData) {
    if (!this.contracts.insurance) {
      throw new Error('Insurance contract not initialized');
    }

    const {
      coverageAmount,
      premium,
      startDate,
      endDate,
      location,
      parameters
    } = policyData;

    // Convert amounts to wei
    const coverageWei = ethers.utils.parseEther(coverageAmount.toString());
    const premiumWei = ethers.utils.parseEther(premium.toString());

    // Convert dates to timestamps
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);

    // Encode parameters
    const encodedParams = this.encodeParameters(parameters);

    const tx = await this.contracts.insurance.createPolicy(
      coverageWei,
      premiumWei,
      startTimestamp,
      endTimestamp,
      location,
      encodedParams,
      {
        value: premiumWei // Send premium as payment
      }
    );

    return tx;
  }

  async getPolicy(policyId) {
    if (!this.contracts.insurance) {
      throw new Error('Insurance contract not initialized');
    }

    const policy = await this.contracts.insurance.policies(policyId);
    return this.formatPolicy(policy);
  }

  async getUserPolicies(userAddress) {
    if (!this.contracts.insurance) {
      throw new Error('Insurance contract not initialized');
    }

    const policyIds = await this.contracts.insurance.getUserPolicies(userAddress);
    const policies = await Promise.all(
      policyIds.map(id => this.getPolicy(id))
    );

    return policies;
  }

  // Claim Management
  async submitClaim(claimData) {
    if (!this.contracts.insurance) {
      throw new Error('Insurance contract not initialized');
    }

    const {
      policyId,
      requestedAmount,
      evidenceHash,
      description
    } = claimData;

    const requestedWei = ethers.utils.parseEther(requestedAmount.toString());

    const tx = await this.contracts.insurance.submitClaim(
      policyId,
      requestedWei,
      evidenceHash,
      description
    );

    return tx;
  }

  async getClaim(claimId) {
    if (!this.contracts.insurance) {
      throw new Error('Insurance contract not initialized');
    }

    const claim = await this.contracts.insurance.claims(claimId);
    return this.formatClaim(claim);
  }

  async getUserClaims(userAddress) {
    if (!this.contracts.insurance) {
      throw new Error('Insurance contract not initialized');
    }

    const claimIds = await this.contracts.insurance.getUserClaims(userAddress);
    const claims = await Promise.all(
      claimIds.map(id => this.getClaim(id))
    );

    return claims;
  }

  // Oracle Data
  async getOracleData(location, dataType) {
    if (!this.contracts.oracle) {
      throw new Error('Oracle contract not initialized');
    }

    const data = await this.contracts.oracle.getData(location, dataType);
    return this.formatOracleData(data);
  }

  async requestOracleUpdate(location, dataType) {
    if (!this.contracts.oracle) {
      throw new Error('Oracle contract not initialized');
    }

    const tx = await this.contracts.oracle.requestUpdate(location, dataType);
    return tx;
  }

  // Utility Methods
  encodeParameters(parameters) {
    const encoder = ethers.utils.defaultAbiCoder;
    return encoder.encode(
      ['string', 'uint256', 'string', 'string'],
      [
        parameters.triggerType,
        ethers.utils.parseUnits(parameters.triggerValue.toString(), 2), // 2 decimal places
        parameters.operator,
        parameters.unit
      ]
    );
  }

  decodeParameters(encodedParams) {
    const decoder = ethers.utils.defaultAbiCoder;
    const [triggerType, triggerValue, operator, unit] = decoder.decode(
      ['string', 'uint256', 'string', 'string'],
      encodedParams
    );

    return {
      triggerType,
      triggerValue: ethers.utils.formatUnits(triggerValue, 2),
      operator,
      unit
    };
  }

  formatPolicy(rawPolicy) {
    return {
      id: rawPolicy.id.toString(),
      owner: rawPolicy.owner,
      coverageAmount: ethers.utils.formatEther(rawPolicy.coverageAmount),
      premium: ethers.utils.formatEther(rawPolicy.premium),
      startDate: new Date(rawPolicy.startTimestamp.toNumber() * 1000).toISOString(),
      endDate: new Date(rawPolicy.endTimestamp.toNumber() * 1000).toISOString(),
      location: rawPolicy.location,
      parameters: this.decodeParameters(rawPolicy.parameters),
      status: this.getPolicyStatus(rawPolicy.status),
      isActive: rawPolicy.isActive,
      claimsCount: rawPolicy.claimsCount.toNumber(),
      createdAt: new Date(rawPolicy.createdAt.toNumber() * 1000).toISOString()
    };
  }

  formatClaim(rawClaim) {
    return {
      id: rawClaim.id.toString(),
      policyId: rawClaim.policyId.toString(),
      claimant: rawClaim.claimant,
      requestedAmount: ethers.utils.formatEther(rawClaim.requestedAmount),
      approvedAmount: rawClaim.approvedAmount.gt(0) 
        ? ethers.utils.formatEther(rawClaim.approvedAmount)
        : null,
      status: this.getClaimStatus(rawClaim.status),
      evidenceHash: rawClaim.evidenceHash,
      description: rawClaim.description,
      submittedAt: new Date(rawClaim.submittedAt.toNumber() * 1000).toISOString(),
      processedAt: rawClaim.processedAt.gt(0)
        ? new Date(rawClaim.processedAt.toNumber() * 1000).toISOString()
        : null
    };
  }

  formatOracleData(rawData) {
    return {
      value: ethers.utils.formatUnits(rawData.value, rawData.decimals),
      timestamp: new Date(rawData.timestamp.toNumber() * 1000).toISOString(),
      isValid: rawData.isValid,
      source: rawData.source
    };
  }

  getPolicyStatus(statusCode) {
    const statuses = ['pending', 'active', 'expired', 'cancelled', 'claimed'];
    return statuses[statusCode] || 'unknown';
  }

  getClaimStatus(statusCode) {
    const statuses = ['pending', 'under_review', 'approved', 'rejected', 'paid'];
    return statuses[statusCode] || 'unknown';
  }

  // Transaction helpers
  async waitForTransaction(txHash, confirmations = 1) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const receipt = await this.provider.waitForTransaction(txHash, confirmations);
    return receipt;
  }

  async getTransactionStatus(txHash) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const tx = await this.provider.getTransaction(txHash);
    const receipt = await this.provider.getTransactionReceipt(txHash);

    return {
      transaction: tx,
      receipt,
      status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending'
    };
  }

  // Gas estimation
  async estimateGas(method, ...args) {
    try {
      const gasEstimate = await method.estimateGas(...args);
      // Add 20% buffer
      return gasEstimate.mul(120).div(100);
    } catch (error) {
      console.error('Gas estimation failed:', error);
      throw error;
    }
  }

  // Event listeners
  addPolicyEventListener(callback) {
    if (!this.contracts.insurance) {
      throw new Error('Insurance contract not initialized');
    }

    this.contracts.insurance.on('PolicyCreated', (policyId, owner, event) => {
      callback('PolicyCreated', { policyId: policyId.toString(), owner, event });
    });

    this.contracts.insurance.on('ClaimSubmitted', (claimId, policyId, claimant, event) => {
      callback('ClaimSubmitted', { 
        claimId: claimId.toString(), 
        policyId: policyId.toString(), 
        claimant, 
        event 
      });
    });

    this.contracts.insurance.on('ClaimProcessed', (claimId, approved, amount, event) => {
      callback('ClaimProcessed', { 
        claimId: claimId.toString(), 
        approved, 
        amount: ethers.utils.formatEther(amount), 
        event 
      });
    });
  }

  removeAllListeners() {
    if (this.contracts.insurance) {
      this.contracts.insurance.removeAllListeners();
    }
    if (this.contracts.oracle) {
      this.contracts.oracle.removeAllListeners();
    }
  }

  // Network utilities
  async switchNetwork(chainId) {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    const hexChainId = `0x${chainId.toString(16)}`;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hexChainId }],
      });
    } catch (error) {
      // Network not added to MetaMask
      if (error.code === 4902) {
        const networkConfig = NETWORK_CONFIG[chainId];
        if (networkConfig) {
          await this.addNetwork(networkConfig);
        } else {
          throw new Error(`Network ${chainId} not supported`);
        }
      } else {
        throw error;
      }
    }
  }

  async addNetwork(networkConfig) {
    if (!window.ethereum) {
      throw new Error('MetaMask not detected');
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig],
    });
  }

  // Contract interaction helpers
  async callWithRetry(method, args = [], maxRetries = 3) {
    let lastError;

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await method(...args);
      } catch (error) {
        lastError = error;
        console.warn(`Contract call attempt ${i + 1} failed:`, error);
        
        if (i < maxRetries - 1) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    throw lastError;
  }
}

// Export singleton instance
export const contractService = new ContractService();

// Export utility functions
export const contractUtils = {
  // Format address for display
  formatAddress: (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Validate address
  isValidAddress: (address) => {
    return ethers.utils.isAddress(address);
  },

  // Format currency
  formatEther: (value) => {
    return ethers.utils.formatEther(value);
  },

  // Parse currency
  parseEther: (value) => {
    return ethers.utils.parseEther(value.toString());
  },

  // Get explorer URL
  getExplorerUrl: (txHash, chainId = 1) => {
    const explorers = {
      1: 'https://etherscan.io',
      3: 'https://ropsten.etherscan.io',
      4: 'https://rinkeby.etherscan.io',
      5: 'https://goerli.etherscan.io',
      137: 'https://polygonscan.com',
      80001: 'https://mumbai.polygonscan.com'
    };

    const baseUrl = explorers[chainId] || explorers[1];
    return `${baseUrl}/tx/${txHash}`;
  },

  // Calculate gas price with buffer
  calculateGasPrice: (gasPrice, bufferPercent = 10) => {
    return gasPrice.mul(100 + bufferPercent).div(100);
  },

  // Convert timestamp to date
  timestampToDate: (timestamp) => {
    return new Date(timestamp * 1000);
  },

  // Convert date to timestamp
  dateToTimestamp: (date) => {
    return Math.floor(new Date(date).getTime() / 1000);
  }
};

export default contractService;