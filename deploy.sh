#!/bin/bash

echo "🚀 Starting Parametric Insurance Deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build frontend first
echo "🔨 Building frontend..."
cd parametric-insurance-frontend
npm run build
cd ..

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at: https://parametric-insurance.vercel.app"