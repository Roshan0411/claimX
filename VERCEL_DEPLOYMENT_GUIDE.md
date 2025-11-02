# 🚀 Deploying Parametric Insurance to Vercel

This guide will help you deploy your Parametric Insurance application to Vercel.

## 📋 Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Environment Variables**: Prepare your API keys and configuration

## 🛠️ Deployment Methods

### Method 1: Deploy via Vercel CLI (Recommended)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Navigate to Project Root
```bash
cd "e:\backup capstone\capstone"
```

#### Step 4: Deploy
```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Choose your account
- Link to existing project? **N** (for first deployment)
- What's your project's name? **parametric-insurance**
- In which directory is your code located? **./**

### Method 2: Deploy via GitHub (Alternative)

#### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/parametric-insurance.git
git push -u origin main
```

#### Step 2: Import to Vercel
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings (Vercel will auto-detect)

## 🔧 Environment Variables Setup

In your Vercel dashboard, add these environment variables:

### Backend Environment Variables
```env
NODE_ENV=production
PORT=3000

# Database/Blockchain
WEB3_PROVIDER_URL=your_web3_provider_url
PRIVATE_KEY=your_private_key_for_oracle_operations
CONTRACT_ADDRESS=your_deployed_contract_address

# IPFS Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt

# Oracle APIs
WEATHER_API_KEY=your_openweather_api_key
FLIGHT_API_KEY=your_aviationstack_api_key
```

### Frontend Environment Variables
```env
REACT_APP_API_BASE_URL=https://your-vercel-deployment.vercel.app/api
REACT_APP_ENVIRONMENT=production
REACT_APP_CONTRACT_ADDRESS=your_contract_address
REACT_APP_CHAIN_ID=1337
```

## 📁 Project Structure for Vercel

Your project should have this structure:
```
parametric-insurance/
├── vercel.json                 # Vercel configuration
├── .vercelignore              # Files to ignore
├── .env.example               # Environment template
├── parametric-insurance-frontend/
│   ├── package.json
│   ├── src/
│   └── public/
└── parametric-insurance-backend/
    ├── package.json
    ├── server.js
    └── src/
```

## ⚙️ Build Configuration

The `vercel.json` file configures:
- Frontend build using React build process
- Backend as Vercel Functions
- API routes under `/api/*`
- Static file serving for the React app

## 🔄 Deployment Process

1. **Frontend**: Built as static files and served from CDN
2. **Backend**: Deployed as serverless functions
3. **API Routes**: Available at `https://your-app.vercel.app/api/*`
4. **Static Assets**: Served from `https://your-app.vercel.app/*`

## 🧪 Testing Your Deployment

After deployment, test these endpoints:

1. **Health Check**: `https://your-app.vercel.app/api/health`
2. **Frontend**: `https://your-app.vercel.app`
3. **Oracle API**: `https://your-app.vercel.app/api/oracle/sources`

## 🔧 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check all dependencies are in package.json
   - Ensure no build errors locally first

2. **API Routes Don't Work**:
   - Verify vercel.json routing configuration
   - Check environment variables are set

3. **CORS Issues**:
   - Update CORS configuration in backend
   - Add your Vercel domain to allowed origins

4. **Web3 Connection Issues**:
   - Ensure contract address is correct
   - Verify Web3 provider URL is accessible

## 🚀 Production Optimizations

1. **Frontend**:
   - Enable React production build
   - Minification and bundling automatic

2. **Backend**:
   - Serverless functions for auto-scaling
   - Cold start optimization

3. **Caching**:
   - Static assets cached by Vercel CDN
   - API responses can be cached

## 📝 Post-Deployment Steps

1. **Update Frontend API URL**:
   - Set `REACT_APP_API_BASE_URL` to your Vercel domain

2. **Test All Features**:
   - Wallet connection
   - Policy creation
   - Claim submission
   - IPFS uploads

3. **Monitor**:
   - Check Vercel analytics
   - Monitor function execution times
   - Watch for errors in logs

## 🔗 Useful Commands

```bash
# Local development
vercel dev

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs YOUR_DEPLOYMENT_URL
```

## 📞 Support

If you encounter issues:
1. Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
2. Review deployment logs in Vercel dashboard
3. Test locally with `vercel dev` first

Your application will be available at: `https://parametric-insurance.vercel.app`