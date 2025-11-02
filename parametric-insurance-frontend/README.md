# Parametric Insurance DApp

A decentralized insurance application powered by blockchain technology and oracles, enabling parametric insurance policies based on real-world data.

## 🚀 Features

- **Decentralized Policies**: Create and manage insurance policies on the blockchain
- **Oracle Integration**: Real-time weather and environmental data for claim validation
- **IPFS Storage**: Decentralized storage for policy documents and evidence
- **Smart Contracts**: Automated claim processing and payouts
- **Web3 Integration**: MetaMask and other wallet support
- **Responsive Design**: Mobile-friendly interface

## 📋 Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension
- Access to an Ethereum network (local, testnet, or mainnet)
- IPFS node (optional, for decentralized storage)

## 🛠️ Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd parametric-insurance-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_CHAIN_ID=1337
   VITE_RPC_URL=http://localhost:8545
   VITE_CONTRACT_ADDRESS=your_contract_address_here
   VITE_IPFS_NODE_URL=http://localhost:5001
   VITE_IPFS_GATEWAY_URL=http://localhost:8080
   ```

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Dashboard.jsx   # Main dashboard
│   ├── CreatePolicy.jsx # Policy creation form
│   ├── PolicyCard.jsx  # Policy display card
│   ├── PolicyList.jsx  # List of policies
│   ├── ClaimForm.jsx   # Claim submission form
│   ├── ClaimCard.jsx   # Claim display card
│   ├── ClaimList.jsx   # List of claims
│   ├── Stats.jsx       # Statistics dashboard
│   └── OraclePanel.jsx # Oracle data panel
├── hooks/              # Custom React hooks
│   ├── useWeb3.js     # Web3 integration hook
│   ├── useContract.js # Contract interaction hook
│   └── useIPFS.js     # IPFS integration hook
├── utils/              # Utility functions
│   ├── web3.js        # Web3 utilities
│   ├── contract.js    # Contract utilities
│   ├── ipfs.js        # IPFS utilities
│   └── constants.js   # Application constants
├── contexts/           # React contexts
│   └── Web3Context.jsx # Web3 context provider
├── services/           # API services
│   ├── api.js         # API client
│   └── ipfsService.js # IPFS service
├── styles/             # CSS styles
│   ├── App.css        # Main styles
│   └── components.css # Component styles
├── App.jsx            # Main application component
└── index.js           # Application entry point
```

## 🔧 Configuration

### Smart Contract

Update the contract address and ABI in `src/utils/constants.js`:

```javascript
export const CONTRACT_ABI = [
  // Your contract ABI here
];

// In .env file
VITE_CONTRACT_ADDRESS=0x...
```

### Network Configuration

The application supports multiple networks. Configure them in `src/utils/constants.js`:

```javascript
export const SUPPORTED_NETWORKS = {
  1: 'Ethereum Mainnet',
  5: 'Goerli Testnet',
  11155111: 'Sepolia Testnet',
  1337: 'Localhost',
};
```

### IPFS Configuration

Configure IPFS endpoints in your `.env` file:

```env
VITE_IPFS_NODE_URL=http://localhost:5001
VITE_IPFS_GATEWAY_URL=http://localhost:8080
```

## 🎯 Usage

### Creating a Policy

1. Connect your MetaMask wallet
2. Navigate to "Create Policy"
3. Fill in the policy details:
   - Coverage amount
   - Premium
   - Duration
   - Location
   - Weather conditions
4. Submit the transaction

### Submitting a Claim

1. Go to "Claims" section
2. Click "Submit New Claim"
3. Select the policy
4. Provide claim details and evidence
5. Submit for processing

### Oracle Integration

The application integrates with weather oracles to:
- Validate claims automatically
- Fetch real-time weather data
- Store oracle data on IPFS
- Trigger automated payouts

## 🔐 Security

- All sensitive data is stored on IPFS
- Smart contracts handle all financial transactions
- Private keys never leave your browser
- All transactions require user confirmation

## 🛠️ Development

### Adding New Components

1. Create component in `src/components/`
2. Import and use in routing
3. Add any required styles
4. Update documentation

### Adding New Hooks

1. Create hook in `src/hooks/`
2. Follow naming convention `use[Name].js`
3. Export from index file
4. Add JSDoc comments

### Testing

```bash
npm run test
# or
yarn test
```

### Linting

```bash
npm run lint
# or
yarn lint
```

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

MetaMask extension required for Web3 functionality.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🔄 Version History

- v1.0.0 - Initial release
  - Basic policy creation and management
  - Claim submission and processing
  - Oracle integration
  - IPFS storage
  - Web3 wallet integration

## 🔮 Roadmap

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-chain support
- [ ] Additional oracle data sources
- [ ] Automated claim processing
- [ ] Governance token integration

---

Built with ❤️ using React, Vite, and Web3 technologies.