import { useWeb3Context } from '../contexts/Web3Context';

// Main Web3 hook
export const useWeb3 = () => {
  return useWeb3Context();
};

// Hook for wallet connection operations
export const useWallet = () => {
  const {
    account,
    balance,
    isConnected,
    isConnecting,
    formattedAddress,
    connectWallet,
    disconnectWallet,
    updateBalance,
  } = useWeb3Context();

  return {
    account,
    balance,
    isConnected,
    isConnecting,
    formattedAddress,
    connectWallet,
    disconnectWallet,
    updateBalance,
  };
};

// Hook for network operations
export const useNetwork = () => {
  const {
    chainId,
    networkName,
    isNetworkSupported,
    switchNetwork,
    addNetwork,
  } = useWeb3Context();

  // Network configurations
  const networks = {
    1: {
      chainId: '0x1',
      chainName: 'Ethereum Mainnet',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://mainnet.infura.io/v3/'],
      blockExplorerUrls: ['https://etherscan.io/'],
    },
    5: {
      chainId: '0x5',
      chainName: 'Goerli Testnet',
      nativeCurrency: {
        name: 'Goerli Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://goerli.infura.io/v3/'],
      blockExplorerUrls: ['https://goerli.etherscan.io/'],
    },
    11155111: {
      chainId: '0xaa36a7',
      chainName: 'Sepolia Testnet',
      nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['https://sepolia.infura.io/v3/'],
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
    },
    1337: {
      chainId: '0x539',
      chainName: 'Localhost 8545',
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: ['http://localhost:8545'],
      blockExplorerUrls: [],
    },
  };

  const addNetworkToWallet = async (targetChainId) => {
    const networkConfig = networks[targetChainId];
    if (networkConfig) {
      return await addNetwork(networkConfig);
    }
    return false;
  };

  return {
    chainId,
    networkName,
    isNetworkSupported,
    switchNetwork,
    addNetworkToWallet,
    networks,
  };
};

// Hook for transaction operations
export const useTransactions = () => {
  const { provider, signer, account } = useWeb3Context();

  const sendTransaction = async (transactionConfig) => {
    if (!signer) {
      throw new Error('No signer available');
    }

    try {
      const tx = await signer.sendTransaction(transactionConfig);
      return tx;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  };

  const getTransactionReceipt = async (txHash) => {
    if (!provider) {
      throw new Error('No provider available');
    }

    try {
      return await provider.getTransactionReceipt(txHash);
    } catch (error) {
      console.error('Failed to get transaction receipt:', error);
      throw error;
    }
  };

  const waitForTransaction = async (txHash, confirmations = 1) => {
    if (!provider) {
      throw new Error('No provider available');
    }

    try {
      return await provider.waitForTransaction(txHash, confirmations);
    } catch (error) {
      console.error('Failed to wait for transaction:', error);
      throw error;
    }
  };

  const estimateGas = async (transactionConfig) => {
    if (!provider) {
      throw new Error('No provider available');
    }

    try {
      return await provider.estimateGas(transactionConfig);
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  };

  return {
    sendTransaction,
    getTransactionReceipt,
    waitForTransaction,
    estimateGas,
  };
};

// Hook for error handling
export const useWeb3Error = () => {
  const { error, clearError } = useWeb3Context();

  const getErrorMessage = (error) => {
    if (!error) return null;

    // Handle common error types
    if (error.code === 4001) {
      return 'Transaction rejected by user';
    }
    if (error.code === 4902) {
      return 'Network not added to wallet';
    }
    if (error.code === -32602) {
      return 'Invalid parameters';
    }
    if (error.code === -32603) {
      return 'Internal error';
    }

    // Handle string errors
    if (typeof error === 'string') {
      if (error.includes('insufficient funds')) {
        return 'Insufficient funds for transaction';
      }
      if (error.includes('user rejected')) {
        return 'Transaction rejected by user';
      }
      if (error.includes('network')) {
        return 'Network connection error';
      }
    }

    // Handle error objects
    if (error.message) {
      return error.message;
    }

    return 'An unexpected error occurred';
  };

  return {
    error,
    errorMessage: getErrorMessage(error),
    clearError,
  };
};

export default useWeb3;