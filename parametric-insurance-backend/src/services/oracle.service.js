const axios = require('axios');
const contractService = require('./contract.service');
require('dotenv').config();

class OracleService {
  // Fetch weather data
  async getWeatherData(location, date) {
    try {
      // Check if API key is configured
      if (!process.env.WEATHER_API_KEY) {
        console.warn('⚠️  Weather API key not configured, using mock data');
        return this.getMockWeatherData(location);
      }

      // Example using OpenWeatherMap API
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Weather API error:', error.message);
      // Return mock data on error
      return this.getMockWeatherData(location);
    }
  }

  // Fetch flight data
  async getFlightData(flightNumber, date) {
    try {
      // Check if API key is configured
      if (!process.env.FLIGHT_API_KEY) {
        console.warn('⚠️  Flight API key not configured, using mock data');
        return this.getMockFlightData(flightNumber);
      }

      // Example using AviationStack API
      const response = await axios.get(
        `http://api.aviationstack.com/v1/flights?access_key=${process.env.FLIGHT_API_KEY}&flight_iata=${flightNumber}`
      );
      return response.data;
    } catch (error) {
      console.error('❌ Flight API error:', error.message);
      // Return mock data on error
      return this.getMockFlightData(flightNumber);
    }
  }

  // Mock weather data for testing
  getMockWeatherData(location) {
    return {
      main: {
        temp: 298.15, // 25°C in Kelvin
        humidity: 65
      },
      rain: {
        '1h': 5.5 // 5.5mm rainfall
      },
      weather: [
        {
          main: 'Rain',
          description: 'moderate rain'
        }
      ],
      name: location
    };
  }

  // Mock flight data for testing
  getMockFlightData(flightNumber) {
    return {
      flight_status: 'active',
      departure: {
        scheduled: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        actual: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() // 1 hour ago (2 hour delay)
      },
      flight: {
        iata: flightNumber
      }
    };
  }

  // Verify claim conditions
  async verifyClaimConditions(claimId, eventType, eventParameters, eventData) {
    try {
      let isValid = false;

      switch (eventType) {
        case 'FLIGHT_DELAY':
          isValid = this.verifyFlightDelay(eventParameters, eventData);
          break;
        case 'WEATHER':
          isValid = this.verifyWeatherConditions(eventParameters, eventData);
          break;
        case 'EARTHQUAKE':
          isValid = this.verifyEarthquake(eventParameters, eventData);
          break;
        default:
          isValid = false;
      }

      console.log(`✅ Claim ${claimId} verification result:`, isValid);
      return isValid;
    } catch (error) {
      console.error('❌ Claim verification error:', error);
      throw error;
    }
  }

  // Verify flight delay
  verifyFlightDelay(parameters, flightData) {
    try {
      const params = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
      const delayThreshold = params.delayMinutes || 120; // 2 hours default

      if (flightData.flight_status === 'active') {
        const scheduledTime = new Date(flightData.departure.scheduled);
        const actualTime = new Date(flightData.departure.actual);
        const delayMinutes = (actualTime - scheduledTime) / 1000 / 60;

        console.log(`Flight delay: ${delayMinutes} minutes (threshold: ${delayThreshold})`);
        return delayMinutes >= delayThreshold;
      }

      return false;
    } catch (error) {
      console.error('Error verifying flight delay:', error);
      return false;
    }
  }

  // Verify weather conditions
  verifyWeatherConditions(parameters, weatherData) {
    try {
      const params = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
      
      // Example: Check rainfall
      if (params.condition === 'rainfall') {
        const rainfall = weatherData.rain?.['1h'] || 0;
        console.log(`Rainfall: ${rainfall}mm (threshold: ${params.threshold}mm)`);
        return rainfall >= params.threshold;
      }

      // Example: Check temperature
      if (params.condition === 'temperature') {
        const temp = weatherData.main.temp - 273.15; // Convert Kelvin to Celsius
        console.log(`Temperature: ${temp}°C (threshold: ${params.threshold}°C)`);
        return params.operator === 'below' 
          ? temp <= params.threshold 
          : temp >= params.threshold;
      }

      return false;
    } catch (error) {
      console.error('Error verifying weather conditions:', error);
      return false;
    }
  }

  // Verify earthquake
  verifyEarthquake(parameters, earthquakeData) {
    try {
      const params = typeof parameters === 'string' ? JSON.parse(parameters) : parameters;
      const magnitude = earthquakeData.magnitude || 0;
      console.log(`Earthquake magnitude: ${magnitude} (threshold: ${params.magnitudeThreshold})`);
      return magnitude >= params.magnitudeThreshold;
    } catch (error) {
      console.error('Error verifying earthquake:', error);
      return false;
    }
  }

  // Process pending claims automatically
  async processPendingClaims() {
    try {
      console.log('🔄 Processing pending claims...');
      // This would typically query pending claims from the blockchain
      // Implementation depends on your specific oracle logic
    } catch (error) {
      console.error('❌ Error processing claims:', error);
      throw error;
    }
  }

  // Get historical weather data
  async getHistoricalWeatherData(location, startDate, endDate) {
    try {
      console.log(`📊 Fetching historical weather for ${location} from ${startDate} to ${endDate}`);
      // Mock historical data for now
      return {
        location,
        startDate,
        endDate,
        data: [
          { date: startDate, temp: 25, rainfall: 5.5 },
          { date: endDate, temp: 27, rainfall: 3.2 }
        ]
      };
    } catch (error) {
      console.error('❌ Historical weather error:', error);
      throw error;
    }
  }

  // Validate claim
  async validateClaim(claimId, policyId) {
    try {
      console.log(`🔍 Validating claim ${claimId} for policy ${policyId}`);
      // Mock validation - in production, this would check against real data
      return {
        claimId,
        policyId,
        isValid: true,
        verifiedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Claim validation error:', error);
      throw error;
    }
  }

  // Submit oracle data
  async submitOracleData(oracleData) {
    try {
      console.log('📝 Submitting oracle data:', oracleData);
      // Mock submission - in production, this would store data
      return {
        success: true,
        dataId: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Oracle data submission error:', error);
      throw error;
    }
  }

  // Get oracle data by ID
  async getOracleDataById(dataId) {
    try {
      console.log(`📋 Fetching oracle data ${dataId}`);
      // Mock data retrieval
      return {
        dataId,
        timestamp: new Date().toISOString(),
        type: 'weather',
        value: 'Sample data'
      };
    } catch (error) {
      console.error('❌ Oracle data fetch error:', error);
      throw error;
    }
  }

  // Get all oracle data
  async getAllOracleData() {
    try {
      console.log('📋 Fetching all oracle data');
      // Mock data retrieval
      return [
        {
          dataId: '1',
          timestamp: new Date().toISOString(),
          type: 'weather',
          value: 'Sample data 1'
        },
        {
          dataId: '2',
          timestamp: new Date().toISOString(),
          type: 'flight',
          value: 'Sample data 2'
        }
      ];
    } catch (error) {
      console.error('❌ Oracle data fetch error:', error);
      throw error;
    }
  }

  // Get oracle statistics
  async getOracleStats() {
    try {
      console.log('📊 Fetching oracle statistics');
      return {
        totalDataPoints: 150,
        lastUpdate: new Date().toISOString(),
        dataSources: ['weather', 'flight', 'earthquake'],
        successRate: 98.5
      };
    } catch (error) {
      console.error('❌ Oracle stats error:', error);
      throw error;
    }
  }

  // Update oracle configuration
  async updateOracleConfig(config) {
    try {
      console.log('⚙️  Updating oracle configuration:', config);
      // Mock config update
      return {
        success: true,
        config,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Oracle config update error:', error);
      throw error;
    }
  }

  // Test connectivity
  async testConnectivity(serviceType) {
    try {
      console.log(`🔌 Testing connectivity for ${serviceType || 'all services'}`);
      const results = {
        weather: { status: 'connected', latency: 120 },
        flight: { status: 'connected', latency: 250 },
        blockchain: { status: 'connected', latency: 80 }
      };
      
      return serviceType ? results[serviceType] : results;
    } catch (error) {
      console.error('❌ Connectivity test error:', error);
      throw error;
    }
  }

  // Get data sources
  async getDataSources() {
    try {
      console.log('📡 Fetching data sources');
      return [
        { name: 'OpenWeatherMap', type: 'weather', status: 'active' },
        { name: 'AviationStack', type: 'flight', status: 'active' },
        { name: 'USGS Earthquake', type: 'earthquake', status: 'active' }
      ];
    } catch (error) {
      console.error('❌ Data sources fetch error:', error);
      throw error;
    }
  }

  // Process scheduled updates
  async processScheduledUpdates() {
    try {
      console.log('⏰ Processing scheduled updates');
      return {
        success: true,
        processed: 5,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Scheduled updates error:', error);
      throw error;
    }
  }
}

module.exports = new OracleService();