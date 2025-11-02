import React, { useState, useEffect } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import { getAllUsersAPI, verifyUserAPI, updateUserStatusAPI, getUserDetailsAPI } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/components.css';

const UserManagement = () => {
  const { account } = useWeb3Context();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsersAPI();
      if (response.success) {
        setUsers(response.data.users);
        setUserStats({
          totalUsers: response.data.totalUsers,
          activeUsers: response.data.activeUsers,
          pendingVerification: response.data.pendingVerification
        });
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (userId, action, data = {}) => {
    try {
      setLoading(true);
      
      let response;
      let message = '';
      
      switch (action) {
        case 'verify':
          response = await verifyUserAPI(userId, data);
          message = `User ${userId} verified successfully`;
          break;
        case 'ban':
          response = await updateUserStatusAPI(userId, 'banned', 'Banned by admin');
          message = `User ${userId} has been banned`;
          break;
        case 'activate':
          response = await updateUserStatusAPI(userId, 'active', 'Activated by admin');
          message = `User ${userId} has been activated`;
          break;
        case 'suspend':
          response = await updateUserStatusAPI(userId, 'suspended', 'Suspended by admin');
          message = `User ${userId} has been suspended`;
          break;
        default:
          message = `Action ${action} completed for user ${userId}`;
      }
      
      if (response && response.success) {
        toast.success(message);
        await loadUsers(); // Reload users
        setShowModal(null);
      } else {
        throw new Error(response?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('User action error:', error);
      toast.error(`Failed to ${action} user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'suspended': return 'warning';
      case 'banned': return 'danger';
      default: return 'secondary';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>👥 User Management</h1>
        <p>Manage platform users and their activities</p>
      </div>

      {/* User Statistics */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{userStats.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{userStats.activeUsers || 0}</h3>
            <p>Active Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>{userStats.pendingVerification || 0}</h3>
            <p>Pending Verification</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>94.2%</h3>
            <p>User Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by address or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-select">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Address</th>
              <th>Role</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Policies</th>
              <th>Claims</th>
              <th>Risk Score</th>
              <th>Verification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-address">
                    <span className="address">{formatAddress(user.address)}</span>
                    <span className="full-address">{user.address}</span>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role === 'oracle' ? '🔮' : '👤'} {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </td>
                <td>{formatDate(user.joinDate)}</td>
                <td>{user.totalPolicies}</td>
                <td>{user.totalClaims}</td>
                <td>
                  <span className={`risk-badge ${getRiskColor(user.riskScore)}`}>
                    {user.riskScore}
                  </span>
                </td>
                <td>
                  <span className={`verification-badge ${user.verificationStatus}`}>
                    {user.verificationStatus === 'verified' ? '✅' : '⏳'} {user.verificationStatus}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal('details');
                      }}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => {
                        setSelectedUser(user);
                        setShowModal('actions');
                      }}
                    >
                      Manage
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-users">
            <p>No users found matching your criteria</p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {showModal === 'details' && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👤 User Details</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="user-details">
                <div className="detail-section">
                  <h4>Basic Information</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Address:</label>
                      <span>{selectedUser.address}</span>
                    </div>
                    <div className="detail-item">
                      <label>Role:</label>
                      <span>{selectedUser.role}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status:</label>
                      <span className={`status-badge ${getStatusColor(selectedUser.status)}`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Join Date:</label>
                      <span>{formatDate(selectedUser.joinDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Activity Summary</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Total Policies:</label>
                      <span>{selectedUser.totalPolicies}</span>
                    </div>
                    <div className="detail-item">
                      <label>Total Claims:</label>
                      <span>{selectedUser.totalClaims}</span>
                    </div>
                    <div className="detail-item">
                      <label>Total Premiums:</label>
                      <span>{selectedUser.totalPremiums}</span>
                    </div>
                    <div className="detail-item">
                      <label>Risk Score:</label>
                      <span className={`risk-badge ${getRiskColor(selectedUser.riskScore)}`}>
                        {selectedUser.riskScore}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Verification & Security</h4>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Verification Status:</label>
                      <span className={`verification-badge ${selectedUser.verificationStatus}`}>
                        {selectedUser.verificationStatus === 'verified' ? '✅' : '⏳'} {selectedUser.verificationStatus}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Last Activity:</label>
                      <span>{new Date(selectedUser.lastActivity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Actions Modal */}
      {showModal === 'actions' && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>⚙️ Manage User</h3>
              <button className="modal-close" onClick={() => setShowModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="user-actions">
                <p>Manage user: {formatAddress(selectedUser.address)}</p>
                
                <div className="action-grid">
                  {selectedUser.verificationStatus === 'pending' && (
                    <button
                      className="action-btn verify"
                      onClick={() => handleUserAction(selectedUser.id, 'verify')}
                      disabled={loading}
                    >
                      ✅ Verify User
                    </button>
                  )}
                  
                  {selectedUser.status === 'active' && (
                    <button
                      className="action-btn suspend"
                      onClick={() => handleUserAction(selectedUser.id, 'suspend')}
                      disabled={loading}
                    >
                      ⏸️ Suspend User
                    </button>
                  )}
                  
                  {selectedUser.status === 'suspended' && (
                    <button
                      className="action-btn activate"
                      onClick={() => handleUserAction(selectedUser.id, 'activate')}
                      disabled={loading}
                    >
                      ▶️ Activate User
                    </button>
                  )}
                  
                  {selectedUser.status !== 'banned' && (
                    <button
                      className="action-btn ban"
                      onClick={() => handleUserAction(selectedUser.id, 'ban')}
                      disabled={loading}
                    >
                      🚫 Ban User
                    </button>
                  )}
                  
                  <button
                    className="action-btn reset"
                    onClick={() => handleUserAction(selectedUser.id, 'reset-password')}
                    disabled={loading}
                  >
                    🔑 Reset 2FA
                  </button>
                  
                  <button
                    className="action-btn audit"
                    onClick={() => handleUserAction(selectedUser.id, 'audit')}
                    disabled={loading}
                  >
                    📋 Audit Logs
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

export default UserManagement;