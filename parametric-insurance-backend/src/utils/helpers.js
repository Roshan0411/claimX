// Helper functions
const formatAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(38)}`;
};

const formatTimestamp = (timestamp) => {
  return new Date(Number(timestamp) * 1000).toLocaleString();
};

// Validation middleware
const validateWeatherQuery = (req, res, next) => {
  const { location } = req.query;
  
  if (!location) {
    return res.status(400).json({
      success: false,
      error: 'Location parameter is required'
    });
  }
  
  next();
};

const validateOracleData = (req, res, next) => {
  const { dataType, value } = req.body;
  
  if (!dataType || value === undefined) {
    return res.status(400).json({
      success: false,
      error: 'dataType and value are required'
    });
  }
  
  next();
};

module.exports = {
  formatAddress,
  formatTimestamp,
  validateWeatherQuery,
  validateOracleData
};