# Contract Deployment Instructions

## Prerequisites
1. **MetaMask Wallet** with Sepolia ETH
2. **Private Key** from your MetaMask wallet
3. **Infura API Key** (you already have this)

## Steps to Deploy

### 1. Install Dependencies
```bash
cd contracts
npm install
```

### 2. Add Your Private Key
Edit `hardhat.config.js` and add your private key:
```javascript
accounts: [
  "YOUR_PRIVATE_KEY_HERE" // Replace with your actual private key
]
```

⚠️ **SECURITY WARNING**: Never commit your private key to git!

### 3. Get Sepolia ETH
- Visit: https://sepoliafaucet.com/
- Enter your wallet address
- Get free test ETH

### 4. Deploy Contract
```bash
npm run deploy:sepolia
```

### 5. Update Application
Copy the deployed contract address and update:
- `.env`
- `.env.production` 
- `vercel.json`
- `constants.js`

### 6. Redeploy Application
```bash
cd ..
vercel --prod
```

## Example Output
```
✅ ParametricInsurance deployed to: 0x1234567890abcdef...
🔗 Etherscan URL: https://sepolia.etherscan.io/address/0x1234567890abcdef...
```

## Troubleshooting
- **Insufficient funds**: Get more Sepolia ETH from faucet
- **Network error**: Check Infura API key
- **Private key error**: Ensure private key is correct (64 characters, no 0x prefix)