const contractService = require('../services/contract.service');
const oracleService = require('../services/oracle.service');
const ipfsService = require('../services/ipfs.service');
const web3 = require('../config/web3.config');

class OracleController {
  // Verify and process claim
  async verifyClaim(req, res) {
    try {
      const { claimId, eventType, eventParameters } = req.body;
      
      let eventData;
      
      // Fetch real-world data based on event type
      switch (eventType) {
        case 'FLIGHT_DELAY':
          const { flightNumber, date } = JSON.parse(eventParameters);
          eventData = await oracleService.getFlightData(flightNumber, date);
          break;
          
        case 'WEATHER':
          const { location, date: weatherDate } = JSON.parse(eventParameters);
          eventData = await oracleService.getWeatherData(location, weatherDate);
          break;
          
        default:
          return res.status(400).json({
            success: false,
            error: 'Unsupported event type'
          });
      }

      // Verify conditions
      const isValid = await oracleService.verifyClaimConditions(
        claimId,
        eventType,
        eventParameters,
        eventData
      );

      // Upload event data to IPFS
      const eventDataHash = await ipfsService.uploadJSON(eventData);

      // Get oracle address
      const accounts = await web3.eth.getAccounts();
      const oracleAddress = accounts[0];

      // Approve or reject claim on blockchain
      let tx;
      if (isValid) {
        tx = await contractService.approveClaim(claimId, oracleAddress);
      } else {
        tx = await contractService.rejectClaim(claimId, oracleAddress);
      }

      res.json({
        success: true,
        data: {
          claimId,
          isValid,
          eventDataHash,
          transactionHash: tx.transactionHash,
          eventData
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get weather data
  async getWeatherData(req, res) {
    try {
      const { location, date } = req.query;
      const data = await oracleService.getWeatherData(location, date);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get flight data
  async getFlightData(req, res) {
    try {
      const { flightNumber, date } = req.query;
      const data = await oracleService.getFlightData(flightNumber, date);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get historical weather data
  async getHistoricalWeatherData(req, res) {
    try {
      const { location, startDate, endDate } = req.query;
      const data = await oracleService.getHistoricalWeatherData(location, startDate, endDate);

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Validate claim against oracle data
  async validateClaim(req, res) {
    try {
      const { claimId, policyId } = req.body;
      const result = await oracleService.validateClaim(claimId, policyId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Submit oracle data
  async submitOracleData(req, res) {
    try {
      const oracleData = req.body;
      const result = await oracleService.submitOracleData(oracleData);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get oracle data
  async getOracleData(req, res) {
    try {
      const { dataId } = req.params;
      const data = dataId 
        ? await oracleService.getOracleDataById(dataId)
        : await oracleService.getAllOracleData();

      res.json({
        success: true,
        data
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get oracle statistics
  async getOracleStats(req, res) {
    try {
      const stats = await oracleService.getOracleStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Update oracle configuration
  async updateOracleConfig(req, res) {
    try {
      const config = req.body;
      const result = await oracleService.updateOracleConfig(config);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Test oracle connectivity
  async testOracleConnectivity(req, res) {
    try {
      const { serviceType } = req.params;
      const result = await oracleService.testConnectivity(serviceType);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get supported data sources
  async getDataSources(req, res) {
    try {
      const sources = await oracleService.getDataSources();

      res.json({
        success: true,
        data: sources
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Process scheduled updates
  async processScheduledUpdates(req, res) {
    try {
      const result = await oracleService.processScheduledUpdates();

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Approve claim (oracle only)
  async approveClaim(req, res) {
    try {
      const { claimId } = req.body;
      
      // This would normally call the smart contract
      const result = {
        claimId,
        status: 'approved',
        transactionHash: '0xmockapprove123...',
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `Claim ${claimId} approved by oracle`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Reject claim (oracle only)
  async rejectClaim(req, res) {
    try {
      const { claimId, reason } = req.body;
      
      // This would normally call the smart contract
      const result = {
        claimId,
        status: 'rejected',
        reason: reason || 'Oracle validation failed',
        transactionHash: '0xmockreject456...',
        timestamp: new Date().toISOString()
      };

      res.json({
        success: true,
        message: `Claim ${claimId} rejected by oracle`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new OracleController();

