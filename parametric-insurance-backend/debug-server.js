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
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test each route separately
console.log('Testing route imports...');

try {
  console.log('1. Testing policy routes...');
  const policyRoutes = require('./src/routes/policy.routes');
  app.use('/api/policies', policyRoutes);
  console.log('✅ Policy routes loaded successfully');
} catch (error) {
  console.error('❌ Policy routes failed:', error.message);
}

try {
  console.log('2. Testing claim routes...');
  const claimRoutes = require('./src/routes/claim.routes');
  app.use('/api/claims', claimRoutes);
  console.log('✅ Claim routes loaded successfully');
} catch (error) {
  console.error('❌ Claim routes failed:', error.message);
}

try {
  console.log('3. Testing oracle routes...');
  const oracleRoutes = require('./src/routes/oracle.routes');
  app.use('/api/oracle', oracleRoutes);
  console.log('✅ Oracle routes loaded successfully');
} catch (error) {
  console.error('❌ Oracle routes failed:', error.message);
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: error.message
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});