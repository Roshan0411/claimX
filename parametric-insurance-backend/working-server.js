const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parametric Insurance Backend Running',
    timestamp: new Date().toISOString(),
    contract: process.env.CONTRACT_ADDRESS,
    pinata: process.env.PINATA_API_KEY ? 'Configured' : 'Not configured'
  });
});

// Simple oracle weather endpoint for testing
app.get('/api/oracle/weather', (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }
  
  // Mock weather data
  res.json({
    success: true,
    message: 'Weather data retrieved successfully',
    data: {
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      },
      temperature: Math.round(Math.random() * 30 + 10),
      condition: ['sunny', 'cloudy', 'rainy', 'windy'][Math.floor(Math.random() * 4)],
      humidity: Math.round(Math.random() * 100),
      pressure: Math.round(Math.random() * 50 + 1000),
      timestamp: new Date().toISOString()
    }
  });
});

// Contract info endpoint
app.get('/api/contract/info', (req, res) => {
  res.json({
    success: true,
    data: {
      address: process.env.CONTRACT_ADDRESS,
      network: 'Sepolia',
      chainId: 11155111
    }
  });
});

// IPFS test endpoint
app.get('/api/ipfs/test', async (req, res) => {
  try {
    const ipfsService = require('./src/services/ipfs.service');
    const testData = {
      message: 'IPFS test from API',
      timestamp: new Date().toISOString()
    };
    
    const result = await ipfsService.uploadJSON(testData, { name: 'api-test' });
    
    res.json({
      success: true,
      message: 'IPFS test successful',
      data: {
        hash: result.IpfsHash,
        gateway: ipfsService.getGatewayURL(result.IpfsHash)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'IPFS test failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 Weather API: http://localhost:${PORT}/api/oracle/weather?lat=40.7128&lon=-74.0060`);
  console.log(`🔗 Contract: ${process.env.CONTRACT_ADDRESS}`);
  console.log(`📦 Pinata: ${process.env.PINATA_API_KEY ? 'Configured' : 'Not configured'}`);
});

module.exports = app;