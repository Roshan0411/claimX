import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { toast } from 'react-toastify';
import '../styles/components.css';

const OraclePanel = ({ isAdmin = false }) => {
  const { account } = useWeb3Context();
  const [oracleData, setOracleData] = useState(null);
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(isAdmin ? 'overview' : 'weather');
  const [showModal, setShowModal] = useState(null);
  const [selectedOracle, setSelectedOracle] = useState(null);

  useEffect(() => {
    loadOracleData();
  }, []);

  const loadOracleData = async () => {
    try {
      setLoading(true);
      
      // Mock oracle data
      const mockOracleData = {
        overview: {
          totalOracles: 12,
          activeOracles: 11,
          avgResponseTime: '1.2s',
          reliability: '99.7%',
          dataPointsToday: 15420,
          totalDataPoints: 456789
        },
        oracles: [
          {
            id: 'oracle_1',
            address: '0x742d35Cc6634C0532925a3b8D7b9212A8D2601f2',
            name: 'Weather Oracle #1',
            type: 'weather',
            status: 'active',
            uptime: '99.9%',
            responseTime: '0.8s',
            dataPoints: 5420,
            lastUpdate: Date.now() - 120000,
            reliability: 99.9,
            stake: '50 ETH'
          },
          {
            id: 'oracle_2',
            address: '0x8ba1f109551bD432803012645Hac136c30d0d0F9',
            name: 'Flight Oracle #1',
            type: 'flight',
            status: 'active',
            uptime: '98.5%',
            responseTime: '1.5s',
            dataPoints: 3240,
            lastUpdate: Date.now() - 300000,
            reliability: 98.5,
            stake: '75 ETH'
          },
          {
            id: 'oracle_3',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            name: 'Exchange Rate Oracle',
            type: 'exchange',
            status: 'warning',
            uptime: '95.2%',
            responseTime: '2.1s',
            dataPoints: 1890,
            lastUpdate: Date.now() - 900000,
            reliability: 95.2,
            stake: '30 ETH'
          }
        ],
        dataSources: [
          {
            name: 'OpenWeatherMap',
            type: 'weather',
            status: 'online',
            apiCalls: 12450,
            rateLimit: '1000/hour',
            cost: '$45.20',
            lastUpdate: Date.now() - 60000
          },
          {
            name: 'FlightAware API',
            type: 'flight',
            status: 'online',
            apiCalls: 8920,
            rateLimit: '500/hour',
            cost: '$78.90',
            lastUpdate: Date.now() - 180000
          },
          {
            name: 'CoinGecko API',
            type: 'exchange',
            status: 'warning',
            apiCalls: 3450,
            rateLimit: '100/hour',
            cost: '$12.30',
            lastUpdate: Date.now() - 1200000
          }
        ],
        performance: {
          accuracy: 98.7,
          consensusRate: 94.3,
          disputeRate: 1.2,
          avgValidationTime: '45s'
        }
      };

      setOracleData(mockOracleData);
      setDataSources(mockOracleData.dataSources);
    } catch (error) {
      console.error('Error loading oracle data:', error);
      toast.error('Failed to load oracle data');
    } finally {
      setLoading(false);
    }
  };

  const handleOracleAction = async (oracleId, action) => {
    try {
      setLoading(true);
      
      let message = '';
      switch (action) {
        case 'activate':
          message = `Oracle ${oracleId} activated successfully`;
          break;
        case 'deactivate':
          message = `Oracle ${oracleId} deactivated`;
          break;
        case 'remove':
          message = `Oracle ${oracleId} removed from network`;
          break;
        case 'update':
          message = `Oracle ${oracleId} configuration updated`;
          break;
        default:
          message = `Action ${action} completed for oracle ${oracleId}`;
      }
      
      toast.success(message);
      await loadOracleData();
      setShowModal(null);
    } catch (error) {
      toast.error(`Failed to ${action} oracle`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'warning': return 'warning';
      case 'offline': return 'danger';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'weather': return '🌤️';
      case 'flight': return '✈️';
      case 'exchange': return '💱';
      default: return '🔮';
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="oracle-panel">
      <div className="page-header">
        <h1>🔮 Oracle Management Panel</h1>
        <p>Monitor and manage oracle network performance</p>
      </div>

      {/* Oracle Overview Stats */}
      {oracleData && (
        <div className="oracle-stats">
          <div className="stat-card">
            <div className="stat-icon">🔮</div>
            <div className="stat-content">
              <h3>{oracleData.overview.totalOracles}</h3>
              <p>Total Oracles</p>
              <span className="stat-detail">{oracleData.overview.activeOracles} active</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <h3>{oracleData.overview.avgResponseTime}</h3>
              <p>Avg Response Time</p>
              <span className="stat-detail">Real-time monitoring</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <h3>{oracleData.overview.reliability}</h3>
              <p>Network Reliability</p>
              <span className="stat-detail">99.5% target</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{oracleData.overview.dataPointsToday.toLocaleString()}</h3>
              <p>Data Points Today</p>
              <span className="stat-detail">{oracleData.overview.totalDataPoints.toLocaleString()} total</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        {isAdmin && (
          <>
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'oracles' ? 'active' : ''}`}
              onClick={() => setActiveTab('oracles')}
            >
              🔮 Oracle Nodes
            </button>
            <button 
              className={`tab-btn ${activeTab === 'sources' ? 'active' : ''}`}
              onClick={() => setActiveTab('sources')}
            >
              🌐 Data Sources
            </button>
            <button 
              className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              📈 Performance
            </button>
          </>
        )}
        <button 
          className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
          onClick={() => setActiveTab('weather')}
        >
          🌦️ Weather Data
        </button>
        <button 
          className={`tab-btn ${activeTab === 'flight' ? 'active' : ''}`}
          onClick={() => setActiveTab('flight')}
        >
          ✈️ Flight Data
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && oracleData && (
          <div className="overview-section">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>🎯 Performance Metrics</h3>
                <div className="metrics-list">
                  <div className="metric-item">
                    <span>Accuracy Rate:</span>
                    <span className="success">{oracleData.performance.accuracy}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Consensus Rate:</span>
                    <span className="success">{oracleData.performance.consensusRate}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Dispute Rate:</span>
                    <span className="warning">{oracleData.performance.disputeRate}%</span>
                  </div>
                  <div className="metric-item">
                    <span>Avg Validation:</span>
                    <span>{oracleData.performance.avgValidationTime}</span>
                  </div>
                </div>
              </div>

              <div className="overview-card">
                <h3>⚠️ Recent Alerts</h3>
                <div className="alerts-list">
                  <div className="alert-item warning">
                    <span>🟡</span>
                    <div>
                      <p>Exchange rate oracle showing high latency</p>
                      <small>15 minutes ago</small>
                    </div>
                  </div>
                  <div className="alert-item info">
                    <span>🔵</span>
                    <div>
                      <p>New oracle node connected to network</p>
                      <small>2 hours ago</small>
                    </div>
                  </div>
                  <div className="alert-item success">
                    <span>🟢</span>
                    <div>
                      <p>All weather oracles functioning normally</p>
                      <small>3 hours ago</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'oracles' && oracleData && (
          <div className="oracles-section">
            <div className="section-header">
              <h3>Oracle Nodes</h3>
              <button className="btn btn-primary" onClick={() => setShowModal('add-oracle')}>
                ➕ Add Oracle
              </button>
            </div>
            
            <div className="oracles-grid">
              {oracleData.oracles.map((oracle) => (
                <div key={oracle.id} className="oracle-card">
                  <div className="oracle-header">
                    <div className="oracle-info">
                      <span className="oracle-icon">{getTypeIcon(oracle.type)}</span>
                      <div>
                        <h4>{oracle.name}</h4>
                        <p>{formatAddress(oracle.address)}</p>
                      </div>
                    </div>
                    <span className={`status-badge ${getStatusColor(oracle.status)}`}>
                      {oracle.status}
                    </span>
                  </div>
                  
                  <div className="oracle-metrics">
                    <div className="metric">
                      <label>Uptime:</label>
                      <span>{oracle.uptime}</span>
                    </div>
                    <div className="metric">
                      <label>Response Time:</label>
                      <span>{oracle.responseTime}</span>
                    </div>
                    <div className="metric">
                      <label>Data Points:</label>
                      <span>{oracle.dataPoints.toLocaleString()}</span>
                    </div>
                    <div className="metric">
                      <label>Stake:</label>
                      <span>{oracle.stake}</span>
                    </div>
                    <div className="metric">
                      <label>Last Update:</label>
                      <span>{formatTime(oracle.lastUpdate)}</span>
                    </div>
                  </div>
                  
                  <div className="oracle-actions">
                    <button 
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setSelectedOracle(oracle);
                        setShowModal('oracle-details');
                      }}
                    >
                      Details
                    </button>
                    <button 
                      className="btn btn-sm btn-warning"
                      onClick={() => handleOracleAction(oracle.id, 'update')}
                    >
                      Update
                    </button>
                    {oracle.status === 'active' ? (
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleOracleAction(oracle.id, 'deactivate')}
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleOracleAction(oracle.id, 'activate')}
                      >
                        Activate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="sources-section">
            <h3>Data Sources</h3>
            <div className="sources-table">
              <table>
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>API Calls</th>
                    <th>Rate Limit</th>
                    <th>Cost</th>
                    <th>Last Update</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSources.map((source, index) => (
                    <tr key={index}>
                      <td>
                        <div className="source-name">
                          <span className="source-icon">{getTypeIcon(source.type)}</span>
                          {source.name}
                        </div>
                      </td>
                      <td>
                        <span className="type-badge">{source.type}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusColor(source.status)}`}>
                          {source.status}
                        </span>
                      </td>
                      <td>{source.apiCalls.toLocaleString()}</td>
                      <td>{source.rateLimit}</td>
                      <td>{source.cost}</td>
                      <td>{formatTime(source.lastUpdate)}</td>
                      <td>
                        <button className="btn btn-sm btn-info">Configure</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'performance' && oracleData && (
          <div className="performance-section">
            <h3>Performance Analytics</h3>
            <div className="performance-grid">
              <div className="performance-card">
                <h4>📊 Accuracy Metrics</h4>
                <div className="performance-chart">
                  <div className="chart-placeholder">
                    <p>Accuracy: {oracleData.performance.accuracy}%</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill success" 
                        style={{ width: `${oracleData.performance.accuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="performance-card">
                <h4>🤝 Consensus Rate</h4>
                <div className="performance-chart">
                  <div className="chart-placeholder">
                    <p>Consensus: {oracleData.performance.consensusRate}%</p>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill success" 
                        style={{ width: `${oracleData.performance.consensusRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="performance-card">
                <h4>⚡ Response Times</h4>
                <div className="response-times">
                  <div className="time-metric">
                    <span>Weather:</span>
                    <span>0.8s</span>
                  </div>
                  <div className="time-metric">
                    <span>Flight:</span>
                    <span>1.5s</span>
                  </div>
                  <div className="time-metric">
                    <span>Exchange:</span>
                    <span>2.1s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weather Data Tab */}
        {activeTab === 'weather' && (
          <div className="weather-section">
            <h3>🌦️ Weather Oracle Data</h3>
            <div className="weather-query-form">
              <div className="form-group">
                <label>Location:</label>
                <input type="text" placeholder="Enter city or coordinates" />
              </div>
              <div className="form-group">
                <label>Date Range:</label>
                <input type="date" />
                <span> to </span>
                <input type="date" />
              </div>
              <button className="btn btn-primary">Query Weather Data</button>
            </div>
            <div className="weather-results">
              <div className="weather-card">
                <h4>Current Weather</h4>
                <div className="weather-info">
                  <div className="weather-item">
                    <span>Temperature:</span>
                    <span>22°C</span>
                  </div>
                  <div className="weather-item">
                    <span>Humidity:</span>
                    <span>65%</span>
                  </div>
                  <div className="weather-item">
                    <span>Wind Speed:</span>
                    <span>15 km/h</span>
                  </div>
                  <div className="weather-item">
                    <span>Precipitation:</span>
                    <span>0 mm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Flight Data Tab */}
        {activeTab === 'flight' && (
          <div className="flight-section">
            <h3>✈️ Flight Oracle Data</h3>
            <div className="flight-query-form">
              <div className="form-group">
                <label>Flight Number:</label>
                <input type="text" placeholder="e.g., AA1234" />
              </div>
              <div className="form-group">
                <label>Date:</label>
                <input type="date" />
              </div>
              <button className="btn btn-primary">Query Flight Data</button>
            </div>
            <div className="flight-results">
              <div className="flight-card">
                <h4>Flight Status</h4>
                <div className="flight-info">
                  <div className="flight-item">
                    <span>Status:</span>
                    <span className="status on-time">On Time</span>
                  </div>
                  <div className="flight-item">
                    <span>Departure:</span>
                    <span>14:30 UTC</span>
                  </div>
                  <div className="flight-item">
                    <span>Arrival:</span>
                    <span>18:45 UTC</span>
                  </div>
                  <div className="flight-item">
                    <span>Delay:</span>
                    <span>0 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Oracle Details Modal */}
      {showModal === 'oracle-details' && selectedOracle && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔮 Oracle Details</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="oracle-details">
                <div className="detail-section">
                  <h4>Basic Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Name:</label>
                      <span>{selectedOracle.name}</span>
                    </div>
                    <div className="detail-item">
                      <label>Address:</label>
                      <span>{selectedOracle.address}</span>
                    </div>
                    <div className="detail-item">
                      <label>Type:</label>
                      <span>{getTypeIcon(selectedOracle.type)} {selectedOracle.type}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={`status-badge ${getStatusColor(selectedOracle.status)}`}>
                        {selectedOracle.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Performance Metrics</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Uptime:</label>
                      <span>{selectedOracle.uptime}</span>
                    </div>
                    <div className="detail-item">
                      <label>Response Time:</label>
                      <span>{selectedOracle.responseTime}</span>
                    </div>
                    <div className="detail-item">
                      <label>Reliability:</label>
                      <span>{selectedOracle.reliability}%</span>
                    </div>
                    <div className="detail-item">
                      <label>Data Points:</label>
                      <span>{selectedOracle.dataPoints.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Staking Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Stake Amount:</label>
                      <span>{selectedOracle.stake}</span>
                    </div>
                    <div className="detail-item">
                      <label>Last Update:</label>
                      <span>{formatTime(selectedOracle.lastUpdate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Oracle Modal */}
      {showModal === 'add-oracle' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Add New Oracle</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="add-oracle-form">
                <div className="form-group">
                  <label>Oracle Address:</label>
                  <input type="text" placeholder="0x..." />
                </div>
                <div className="form-group">
                  <label>Oracle Name:</label>
                  <input type="text" placeholder="Weather Oracle #2" />
                </div>
                <div className="form-group">
                  <label>Type:</label>
                  <select>
                    <option value="weather">Weather</option>
                    <option value="flight">Flight</option>
                    <option value="exchange">Exchange Rate</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Minimum Stake:</label>
                  <input type="text" placeholder="50 ETH" />
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary" onClick={() => setShowModal(null)}>
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleOracleAction('new', 'add')}
                  >
                    Add Oracle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OraclePanel;