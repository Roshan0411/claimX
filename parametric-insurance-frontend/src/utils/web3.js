import { ethers } from 'ethers';
import { 
  SUPPORTED_NETWORKS, 
  CONTRACT_ABI,
  APP_CONFIG 
} from './constants';

// Web3 utility functions
export const web3Utils = {
  // Format address for display
  formatAddress: (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  },

  // Validate Ethereum address
  isValidAddress: (address) => {
    if (!address || typeof address !== 'string') return false;
    return ethers.isAddress(address);
  },

  // Convert Wei to Ether
  weiToEther: (weiValue) => {
    if (!weiValue) return '0';
    try {
      return ethers.formatEther(weiValue);
    } catch (error) {
      console.error('Error converting Wei to Ether:', error);
      return '0';
    }
  },

  // Convert Ether to Wei
  etherToWei: (etherValue) => {
    if (!etherValue) return '0';
    try {
      return ethers.parseEther(etherValue.toString());
    } catch (error) {
      console.error('Error converting Ether to Wei:', error);
      return '0';
    }
  },

  // Format Ether value for display
  formatEther: (value, decimals = 4) => {
    if (!value) return '0';
    try {
      const etherValue = typeof value === 'string' ? value : ethers.formatEther(value);
      const num = parseFloat(etherValue);
      return num.toFixed(decimals);
    } catch (error) {
      console.error('Error formatting Ether:', error);
      return '0';
    }
  },

  // Get network info by chain ID
  getNetworkInfo: (chainId) => {
    return SUPPORTED_NETWORKS[chainId] || null;
  },

  // Check if network is supported
  isNetworkSupported: (chainId) => {
    return chainId in SUPPORTED_NETWORKS;
  },

  // Generate block explorer URL
  getBlockExplorerUrl: (chainId, type, hash) => {
    const network = SUPPORTED_NETWORKS[chainId];
    if (!network || !network.blockExplorer) return null;
    
    const baseUrl = network.blockExplorer;
    switch (type) {
      case 'tx':
        return `${baseUrl}/tx/${hash}`;
      case 'address':
        return `${baseUrl}/address/${hash}`;
      case 'block':
        return `${baseUrl}/block/${hash}`;
      default:
        return baseUrl;
    }
  },

  // Estimate gas price
  estimateGasPrice: async (provider) => {
    if (!provider) return null;
    
    try {
      const gasPrice = await provider.getFeeData();
      return gasPrice.gasPrice;
    } catch (error) {
      console.error('Error estimating gas price:', error);
      return null;
    }
  },

  // Calculate transaction fee
  calculateTxFee: (gasUsed, gasPrice) => {
    if (!gasUsed || !gasPrice) return '0';
    
    try {
      const fee = BigInt(gasUsed) * BigInt(gasPrice);
      return ethers.formatEther(fee);
    } catch (error) {
      console.error('Error calculating transaction fee:', error);
      return '0';
    }
  },

  // Wait for transaction confirmation
  waitForTransaction: async (provider, txHash, confirmations = 1) => {
    if (!provider || !txHash) return null;
    
    try {
      return await provider.waitForTransaction(txHash, confirmations);
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      throw error;
    }
  },

  // Get transaction receipt
  getTransactionReceipt: async (provider, txHash) => {
    if (!provider || !txHash) return null;
    
    try {
      return await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Error getting transaction receipt:', error);
      return null;
    }
  },

  // Check if transaction was successful
  isTransactionSuccessful: (receipt) => {
    return receipt && receipt.status === 1;
  },

  // Parse contract error
  parseContractError: (error) => {
    if (!error) return 'Unknown error';
    
    // Handle revert errors
    if (error.reason) {
      return error.reason;
    }
    
    // Handle custom errors
    if (error.data && error.data.message) {
      return error.data.message;
    }
    
    // Handle common error codes
    if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
      return 'Transaction would fail. Please check your inputs.';
    }
    
    if (error.code === 'INSUFFICIENT_FUNDS') {
      return 'Insufficient funds for transaction.';
    }
    
    if (error.code === 'NONCE_EXPIRED') {
      return 'Transaction nonce expired. Please try again.';
    }
    
    if (error.code === 'REPLACEMENT_UNDERPRICED') {
      return 'Gas price too low for replacement transaction.';
    }
    
    if (error.code === 'USER_REJECTED') {
      return 'Transaction rejected by user.';
    }
    
    // Default to error message
    return error.message || 'Transaction failed';
  },

  // Create contract instance
  createContract: (address, provider) => {
    if (!address || !provider || !CONTRACT_ABI) return null;
    
    try {
      return new ethers.Contract(address, CONTRACT_ABI, provider);
    } catch (error) {
      console.error('Error creating contract instance:', error);
      return null;
    }
  },

  // Sign message
  signMessage: async (signer, message) => {
    if (!signer || !message) return null;
    
    try {
      return await signer.signMessage(message);
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  },

  // Verify signature
  verifySignature: (message, signature, address) => {
    if (!message || !signature || !address) return false;
    
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      return recoveredAddress.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Error verifying signature:', error);
      return false;
    }
  },

  // Generate message for signing
  generateSignMessage: (data) => {
    const timestamp = Date.now();
    return `Please sign this message to authenticate with Parametric Insurance DApp.\n\nTimestamp: ${timestamp}\nData: ${JSON.stringify(data)}`;
  },

  // Check if wallet is connected
  isWalletConnected: () => {
    return typeof window !== 'undefined' && 
           typeof window.ethereum !== 'undefined' &&
           window.ethereum.isConnected();
  },

  // Get current gas prices (fast, standard, safe)
  getGasPrices: async (provider) => {
    if (!provider) return null;
    
    try {
      const feeData = await provider.getFeeData();
      return {
        fast: feeData.maxFeePerGas,
        standard: feeData.gasPrice,
        safe: feeData.gasPrice ? feeData.gasPrice * BigInt(80) / BigInt(100) : null,
      };
    } catch (error) {
      console.error('Error getting gas prices:', error);
      return null;
    }
  },

  // Convert hex to decimal
  hexToDecimal: (hex) => {
    if (!hex) return 0;
    return parseInt(hex, 16);
  },

  // Convert decimal to hex
  decimalToHex: (decimal) => {
    if (!decimal) return '0x0';
    return `0x${decimal.toString(16)}`;
  },

  // Get current block number
  getCurrentBlock: async (provider) => {
    if (!provider) return null;
    
    try {
      return await provider.getBlockNumber();
    } catch (error) {
      console.error('Error getting current block:', error);
      return null;
    }
  },

  // Get block by number
  getBlock: async (provider, blockNumber) => {
    if (!provider || blockNumber === null || blockNumber === undefined) return null;
    
    try {
      return await provider.getBlock(blockNumber);
    } catch (error) {
      console.error('Error getting block:', error);
      return null;
    }
  },

  // Check if address is a contract
  isContract: async (provider, address) => {
    if (!provider || !address) return false;
    
    try {
      const code = await provider.getCode(address);
      return code !== '0x';
    } catch (error) {
      console.error('Error checking if address is contract:', error);
      return false;
    }
  },

  // Get ENS name for address
  getENSName: async (provider, address) => {
    if (!provider || !address) return null;
    
    try {
      return await provider.lookupAddress(address);
    } catch (error) {
      // ENS lookup can fail, return null instead of throwing
      return null;
    }
  },

  // Resolve ENS name to address
  resolveENSName: async (provider, ensName) => {
    if (!provider || !ensName) return null;
    
    try {
      return await provider.resolveName(ensName);
    } catch (error) {
      console.error('Error resolving ENS name:', error);
      return null;
    }
  },
};

export default web3Utils;