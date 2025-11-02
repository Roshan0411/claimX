#!/bin/bash
echo "Building frontend..."
cd parametric-insurance-frontend
npm install
npm run build
cd ..
echo "Frontend build completed!"