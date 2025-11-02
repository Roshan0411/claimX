const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parametric Insurance Backend Running',
    timestamp: new Date().toISOString()
  });
});

// Import and use routes one by one
console.log('Loading routes...');

try {
  const policyRoutes = require('./src/routes/policy.routes');
  app.use('/api/policies', policyRoutes);
  console.log('✅ Policy routes loaded');
} catch (error) {
  console.error('❌ Policy routes failed:', error.message);
}

try {
  const claimRoutes = require('./src/routes/claim.routes');
  app.use('/api/claims', claimRoutes);
  console.log('✅ Claim routes loaded');
} catch (error) {
  console.error('❌ Claim routes failed:', error.message);
}

try {
  const oracleRoutes = require('./src/routes/oracle.routes');
  app.use('/api/oracle', oracleRoutes);
  console.log('✅ Oracle routes loaded');
} catch (error) {
  console.error('❌ Oracle routes failed:', error.message);
}

// Error handling middleware
const errorMiddleware = require('./src/middleware/error.middleware');
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;