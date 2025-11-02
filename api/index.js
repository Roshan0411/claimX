const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables
dotenv.config();

// Import routes
const policyRoutes = require('../parametric-insurance-backend/src/routes/policy.routes');
const claimRoutes = require('../parametric-insurance-backend/src/routes/claim.routes');
const oracleRoutes = require('../parametric-insurance-backend/src/routes/oracle.routes');
const adminRoutes = require('../parametric-insurance-backend/src/routes/admin.routes');
const userRoutes = require('../parametric-insurance-backend/src/routes/user.routes');
const analyticsRoutes = require('../parametric-insurance-backend/src/routes/analytics.routes');
const settingsRoutes = require('../parametric-insurance-backend/src/routes/settings.routes');

// Import middleware
const errorMiddleware = require('../parametric-insurance-backend/src/middleware/error.middleware');

const app = express();

// Middleware
app.use(cors({
  origin: ['https://parametric-insurance.vercel.app', 'https://parametric-insurance-victolifto65-1130s-projects.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parametric Insurance Backend Running on Vercel',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parametric Insurance Backend Running on Vercel',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Export for Vercel
module.exports = app;