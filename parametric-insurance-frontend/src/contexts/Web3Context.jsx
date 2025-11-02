import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import Web3 from 'web3';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CHAIN_ID, CHAIN_NAME, RPC_URL } from '../utils/constants';
import { toast } from 'react-toastify';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin addresses (add real admin wallet addresses here)
  const adminAddresses = [
    '0x8B78C834a438Ec7f566806cf61aCfc80eDf69e81'.toLowerCase(), // Contract address
    '0x742d35Cc6634C0532925a3b8D7b9212A8D2601f2'.toLowerCase(), // Add your admin address here
    '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'.toLowerCase(), // Example admin address
  ];

  // Check if user is admin
  const checkUserRole = (address) => {
    if (!address) {
      setIsAdmin(false);
      setUserRole('user');
      return;
    }
    
    const normalizedAddress = address.toLowerCase();
    const isAdminUser = adminAddresses.includes(normalizedAddress);
    
    console.log('Checking role for:', normalizedAddress);
    console.log('Admin addresses:', adminAddresses);
    console.log('Is admin:', isAdminUser);
    
    setIsAdmin(isAdminUser);
    setUserRole(isAdminUser ? 'admin' : 'user');
  };

  // Initialize Web3
  const initWeb3 = useCallback(async () => {
    // Debug: Log current configuration
    console.log('=== Web3 Configuration Debug ===');
    console.log('CHAIN_ID:', CHAIN_ID);
    console.log('CHAIN_NAME:', CHAIN_NAME);
    console.log('RPC_URL:', RPC_URL);
    console.log('CONTRACT_ADDRESS:', CONTRACT_ADDRESS);
    console.log('Environment variables:', {
      REACT_APP_CHAIN_ID: process.env.REACT_APP_CHAIN_ID,
      REACT_APP_CHAIN_NAME: process.env.REACT_APP_CHAIN_NAME,
      REACT_APP_RPC_URL: process.env.REACT_APP_RPC_URL,
      REACT_APP_CONTRACT_ADDRESS: process.env.REACT_APP_CONTRACT_ADDRESS
    });
    console.log('================================');

    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);
        
        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );
        setContract(contractInstance);

        const networkId = await web3Instance.eth.getChainId();
        setChainId(Number(networkId));

        // Check if we're on the correct network
        if (Number(networkId) !== CHAIN_ID) {
          toast.warn(`Please switch to ${CHAIN_NAME} network (Chain ID: ${CHAIN_ID})`);
        }

        const accounts = await web3Instance.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          checkUserRole(accounts[0]);
        }

        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            setIsConnected(true);
            checkUserRole(accounts[0]);
          } else {
            disconnectWallet();
          }
        });

        window.ethereum.on('chainChanged', (chainId) => {
          setChainId(Number(chainId));
          const newChainId = Number(chainId);
          if (newChainId !== CHAIN_ID) {
            toast.warn(`Please switch to ${CHAIN_NAME} network (Chain ID: ${CHAIN_ID})`);
          }
          window.location.reload();
        });

      } catch (error) {
        console.error('Error initializing Web3:', error);
        toast.error('Failed to initialize Web3');
      }
    } else {
      toast.error('Please install MetaMask or another Web3 wallet');
    }
  }, []);

  // Switch to correct network
  const switchToCorrectNetwork = async () => {
    if (!window.ethereum) return false;

    try {
      // First try to switch to Sepolia (MetaMask already knows this network)
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID in hex
      });
      return true;
    } catch (switchError) {
      // If network doesn't exist, add Sepolia testnet
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0xaa36a7', // 11155111 in hex
              chainName: 'Sepolia test network',
              rpcUrls: ['https://sepolia.infura.io/v3/1cdfb0cdbac040b89344b6c8df937f89'],
              nativeCurrency: {
                name: 'SepoliaETH',
                symbol: 'SepoliaETH',
                decimals: 18
              },
              blockExplorerUrls: ['https://sepolia.etherscan.io/']
            }],
          });
          return true;
        } catch (addError) {
          console.error('Error adding network:', addError);
          toast.error('Failed to add Sepolia network');
          return false;
        }
      }
      console.error('Error switching network:', switchError);
      toast.error('Failed to switch to Sepolia network');
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask');
      return;
    }

    try {
      setLoading(true);
      
      // First check if we're on the correct network
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const expectedChainId = '0xaa36a7'; // Sepolia chain ID in hex
      
      if (currentChainId !== expectedChainId) {
        toast.info(`Please switch to Sepolia testnet`);
        const switched = await switchToCorrectNetwork();
        if (!switched) {
          setLoading(false);
          return;
        }
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        checkUserRole(accounts[0]);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      if (error.code === 4001) {
        toast.error('User rejected the connection request');
      } else {
        toast.error('Failed to connect wallet');
      }
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
    setUserRole('user');
    setIsAdmin(false);
    toast.info('Wallet disconnected');
  };

  useEffect(() => {
    initWeb3();
  }, [initWeb3]);

  const value = {
    web3,
    account,
    contract,
    chainId,
    loading,
    isConnected,
    userRole,
    isAdmin,
    connectWallet,
    disconnectWallet,
    switchToCorrectNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3Context = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3Context must be used within a Web3Provider');
  }
  return context;
};