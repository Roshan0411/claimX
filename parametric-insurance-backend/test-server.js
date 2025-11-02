const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test route for weather location
app.get('/api/oracle/weather', (req, res) => {
  const { lat, lon } = req.query;
  
  if (!lat || !lon) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }
  
  // Simple mock response for testing location
  res.json({
    success: true,
    message: 'Location received successfully',
    data: {
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      },
      city: lat == 40.7128 && lon == -74.0060 ? 'New York' : 'Unknown',
      temperature: Math.round(Math.random() * 30 + 10),
      condition: 'sunny',
      timestamp: new Date().toISOString()
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});