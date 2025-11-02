export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x8B78C834a438Ec7f566806cf61aCfc80eDf69e81';
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID) || 11155111;
export const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME || 'Sepolia';
export const RPC_URL = process.env.REACT_APP_RPC_URL || 'https://sepolia.infura.io/v3/1cdfb0cdbac040b89344b6c8df937f89';

export const CONTRACT_ABI = [
  // PASTE YOUR FULL ABI HERE
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_claimId",
        "type": "uint256"
      }
    ],
    "name": "approveClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oracle",
        "type": "address"
      }
    ],
    "name": "authorizeOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_policyId",
        "type": "uint256"
      }
    ],
    "name": "cancelPolicy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ClaimPaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum ParametricInsurance.ClaimStatus",
        "name": "status",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ClaimStatusUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "claimAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "ClaimSubmitted",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_coverageAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_premium",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_durationInDays",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_eventType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_eventParametersHash",
        "type": "string"
      }
    ],
    "name": "createPolicy",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fundPool",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "oracle",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "OracleAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "oracle",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "OracleRevoked",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_policyId",
        "type": "uint256"
      }
    ],
    "name": "payPremium",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PolicyCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "policyholder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "coverageAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "premium",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "eventType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PolicyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "funder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "PoolFunded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "policyholder",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      }
    ],
    "name": "PremiumPaid",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_claimId",
        "type": "uint256"
      }
    ],
    "name": "processPayout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_claimId",
        "type": "uint256"
      }
    ],
    "name": "rejectClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oracle",
        "type": "address"
      }
    ],
    "name": "revokeOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_feePercentage",
        "type": "uint256"
      }
    ],
    "name": "setPlatformFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_policyId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_eventDataHash",
        "type": "string"
      }
    ],
    "name": "submitClaim",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newAdmin",
        "type": "address"
      }
    ],
    "name": "transferAdmin",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawPlatformFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  },
  {
    "inputs": [],
    "name": "admin",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "authorizedOracles",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "claims",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "claimId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "claimant",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "claimAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claimDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "eventDataHash",
        "type": "string"
      },
      {
        "internalType": "enum ParametricInsurance.ClaimStatus",
        "name": "status",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_claimId",
        "type": "uint256"
      }
    ],
    "name": "getClaimDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "claimId",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "policyId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "claimant",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "claimAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "claimDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "eventDataHash",
            "type": "string"
          },
          {
            "internalType": "enum ParametricInsurance.ClaimStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct ParametricInsurance.Claim",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContractStats",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalPolicies",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalClaims",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "poolBalance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "premiumCollected",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "claimsPaid",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_policyId",
        "type": "uint256"
      }
    ],
    "name": "getPolicyDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "policyId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "policyholder",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "coverageAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "premium",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "startDate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "endDate",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "eventType",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "eventParameters",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isActive",
            "type": "bool"
          },
          {
            "internalType": "bool",
            "name": "claimed",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "claimAmount",
            "type": "uint256"
          }
        ],
        "internalType": "struct ParametricInsurance.Policy",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPoolBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserClaims",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserPolicies",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oracle",
        "type": "address"
      }
    ],
    "name": "isOracleAuthorized",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformFeePercentage",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "policies",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "policyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "policyholder",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "coverageAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "premium",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "startDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endDate",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "eventType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "eventParameters",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "claimed",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "claimAmount",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "policyCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalClaimsPaid",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPoolFunds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalPremiumCollected",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userClaims",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userPolicies",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const CLAIM_STATUS = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Paid'
};

export const EVENT_TYPES = [
  'FLIGHT_DELAY',
  'WEATHER',
  'EARTHQUAKE',
  'CROP_FAILURE',
  'HURRICANE'
];