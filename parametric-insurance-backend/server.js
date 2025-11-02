const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Load environment variables FIRST
dotenv.config();

// Import routes
const policyRoutes = require('./src/routes/policy.routes');
const claimRoutes = require('./src/routes/claim.routes');
const oracleRoutes = require('./src/routes/oracle.routes');
const userRoutes = require('./src/routes/user.routes');
const adminRoutes = require('./src/routes/admin.routes');
const analyticsRoutes = require('./src/routes/analytics.routes');
const settingsRoutes = require('./src/routes/settings.routes');

// Import middleware
const errorMiddleware = require('./src/middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/policies', policyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/oracle', oracleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Parametric Insurance Backend Running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorMiddleware);

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚀 ========================================\n');
});

module.exports = app;