# ClaimX - Parametric Insurance Platform

A comprehensive decentralized parametric insurance platform built on Ethereum, featuring smart contracts, oracles, and a full-stack web application.

## 🚀 Live Demo

**Production URL**: [https://parametric-insurance.vercel.app](https://parametric-insurance.vercel.app)

## 📋 Features

### Core Functionality
- **Smart Contract Insurance**: Ethereum-based parametric insurance policies
- **Oracle Integration**: Real-time weather and flight data verification
- **Automated Claims Processing**: Smart contract-driven claim approval and payouts
- **IPFS Storage**: Decentralized storage for policy parameters and evidence

### Admin Dashboard
- **User Management**: Verify users, manage user status and accounts
- **Claim Management**: Approve/reject claims with real-time updates
- **Analytics Dashboard**: Comprehensive insights and reporting
- **Oracle Management**: Monitor and manage oracle nodes
- **Settings Panel**: Platform configuration and management

### User Interface
- **Policy Creation**: Create custom parametric insurance policies
- **Claim Submission**: Submit claims with evidence
- **Dashboard**: View policies, claims, and account status
- **History Tracking**: Complete transaction and activity history

## 🏗️ Architecture

### Frontend
- **React.js**: Modern React application with hooks and context
- **Web3 Integration**: MetaMask and Web3 connectivity
- **Responsive Design**: Mobile-first responsive UI
- **Real-time Updates**: Live data updates and notifications

### Backend
- **Node.js/Express**: RESTful API server
- **Serverless**: Deployed on Vercel serverless functions
- **CORS Enabled**: Cross-origin resource sharing configured
- **Error Handling**: Comprehensive error management

### Blockchain
- **Ethereum**: Smart contracts on Sepolia testnet
- **Smart Contracts**: Parametric insurance contract with admin functions
- **Web3.js**: Blockchain interaction library
- **MetaMask**: Wallet integration for transactions

### Storage & Data
- **IPFS**: Distributed file storage for documents
- **In-Memory Database**: Demo data persistence for admin functions
- **JSON Configuration**: Contract ABI and configuration management

## 🛠️ Technology Stack

### Frontend Technologies
```
React.js v18
Web3.js
MetaMask SDK
Axios
CSS3 with Modern Features
```

### Backend Technologies
```
Node.js
Express.js
CORS
Body Parser
Morgan Logger
```

### Blockchain & Web3
```
Ethereum
Solidity Smart Contracts
Web3.js
Sepolia Testnet
IPFS
```

### Deployment & DevOps
```
Vercel (Frontend & Serverless Functions)
GitHub (Version Control)
Vercel CLI
```

## 📁 Project Structure

```
claimX/
├── parametric-insurance-frontend/     # React frontend application
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── AdminDashboard.jsx    # Admin interface
│   │   │   ├── UserManagement.jsx    # User admin panel
│   │   │   ├── Analytics.jsx         # Analytics dashboard
│   │   │   ├── OraclePanel.jsx       # Oracle management
│   │   │   ├── Settings.jsx          # Settings panel
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   ├── PolicyManager.jsx     # Policy management
│   │   │   ├── ClaimManager.jsx      # Claim management
│   │   │   └── ...                   # Other components
│   │   ├── contexts/                 # React contexts
│   │   ├── hooks/                    # Custom hooks
│   │   ├── services/                 # API services
│   │   ├── styles/                   # CSS styles
│   │   └── utils/                    # Utility functions
│   └── package.json
├── parametric-insurance-backend/      # Express.js backend
│   ├── src/
│   │   ├── controllers/              # Route controllers
│   │   │   ├── user.controller.js    # User management
│   │   │   ├── admin.controller.js   # Admin operations
│   │   │   ├── analytics.controller.js # Analytics
│   │   │   ├── policy.controller.js  # Policy management
│   │   │   ├── claim.controller.js   # Claim processing
│   │   │   └── oracle.controller.js  # Oracle operations
│   │   ├── routes/                   # Express routes
│   │   ├── middleware/               # Custom middleware
│   │   ├── services/                 # Business logic
│   │   ├── config/                   # Configuration files
│   │   └── utils/                    # Utility functions
│   └── package.json
├── api/                              # Vercel serverless functions
│   └── index.js                      # Main API entry point
├── vercel.json                       # Vercel configuration
├── package.json                      # Root package configuration
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites
```bash
Node.js v16 or higher
npm or yarn
MetaMask wallet
Git
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Roshan0411/claimX.git
cd claimX
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd parametric-insurance-frontend
npm install

# Install backend dependencies
cd ../parametric-insurance-backend
npm install
```

3. **Environment Setup**
Create `.env` files in both frontend and backend directories:

**Frontend (.env)**
```env
REACT_APP_CHAIN_ID=11155111
REACT_APP_CHAIN_NAME=Sepolia
REACT_APP_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
REACT_APP_CONTRACT_ADDRESS=0x8B78C834a438Ec7f566806cf61aCfc80eDf69e81
REACT_APP_BACKEND_URL=http://localhost:5000
```

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
```

### Local Development

1. **Start the backend server**
```bash
cd parametric-insurance-backend
npm start
```

2. **Start the frontend application**
```bash
cd parametric-insurance-frontend
npm start
```

3. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🌐 Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy to Vercel**
```bash
vercel --prod
```

3. **Set up environment variables in Vercel dashboard**
- Configure all environment variables in the Vercel project settings

## 📖 API Documentation

### Admin Endpoints
- `GET /api/admin/claims` - Get all claims
- `POST /api/admin/approve-claim` - Approve a claim
- `POST /api/admin/reject-claim` - Reject a claim

### User Management
- `GET /api/users/all` - Get all users
- `POST /api/users/:id/verify` - Verify a user
- `PUT /api/users/:id/status` - Update user status

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/realtime` - Get real-time data

### Health Check
- `GET /api/health` - API health status

## 🔧 Smart Contract

### Contract Details
- **Network**: Sepolia Testnet
- **Address**: `0x8B78C834a438Ec7f566806cf61aCfc80eDf69e81`
- **Features**: Policy creation, claim processing, oracle management

### Key Functions
- `createPolicy()` - Create new insurance policy
- `submitClaim()` - Submit insurance claim
- `approveClaim()` - Admin approve claim
- `processPayout()` - Process claim payout

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the code examples

## 🔮 Future Enhancements

- [ ] Integration with additional oracle providers
- [ ] Mobile application development
- [ ] Advanced risk assessment algorithms
- [ ] Multi-chain support
- [ ] Enhanced analytics and reporting
- [ ] Machine learning for fraud detection

## 📊 Project Statistics

- **Frontend Components**: 15+ React components
- **Backend Endpoints**: 20+ API endpoints
- **Smart Contract Functions**: 15+ Solidity functions
- **Database Tables**: 5+ data models
- **Test Coverage**: Comprehensive test suite

---

**Built with ❤️ for the decentralized insurance future**