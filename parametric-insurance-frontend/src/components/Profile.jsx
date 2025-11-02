import React, { useState } from 'react';
import { useWeb3Context } from '../contexts/Web3Context';
import '../styles/components.css';

const Profile = () => {
  const { account, isAdmin, userRole } = useWeb3Context();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    preferences: {
      currency: 'ETH',
      language: 'English',
      timezone: 'UTC-5'
    }
  });

  const [accountStats] = useState({
    memberSince: '2024-06-15',
    totalPolicies: 5,
    activePolicies: 3,
    totalClaims: 2,
    successfulClaims: 1,
    totalPremiumPaid: '12.7 ETH',
    totalPayoutsReceived: '5.0 ETH',
    accountScore: 85
  });

  const handleSave = () => {
    setEditing(false);
    // Implement save logic
    console.log('Saving profile:', profile);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <button className="change-avatar-btn">📷</button>
        </div>
        <div className="profile-info">
          <h1>{profile.name}</h1>
          <p className="account-address">{account}</p>
          <div className="role-badge-container">
            <span className={`role-badge ${userRole}`}>
              {isAdmin ? '👑 Administrator' : '👤 User'}
            </span>
            <span className="member-since">
              Member since {accountStats.memberSince}
            </span>
          </div>
        </div>
        <div className="profile-actions">
          {!editing ? (
            <button className="btn-primary" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-success" onClick={handleSave}>
                ✅ Save
              </button>
              <button className="btn-secondary" onClick={() => setEditing(false)}>
                ❌ Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              {editing ? (
                <input 
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              ) : (
                <p>{profile.name}</p>
              )}
            </div>
            <div className="form-group">
              <label>Email Address</label>
              {editing ? (
                <input 
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              ) : (
                <p>{profile.email}</p>
              )}
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              {editing ? (
                <input 
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
            </div>
            <div className="form-group">
              <label>Location</label>
              {editing ? (
                <input 
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({...profile, location: e.target.value})}
                />
              ) : (
                <p>{profile.location}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-icon">📄</span>
              <div className="stat-content">
                <h3>{accountStats.totalPolicies}</h3>
                <p>Total Policies</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">✅</span>
              <div className="stat-content">
                <h3>{accountStats.activePolicies}</h3>
                <p>Active Policies</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">📋</span>
              <div className="stat-content">
                <h3>{accountStats.totalClaims}</h3>
                <p>Total Claims</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💰</span>
              <div className="stat-content">
                <h3>{accountStats.successfulClaims}</h3>
                <p>Successful Claims</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">💳</span>
              <div className="stat-content">
                <h3>{accountStats.totalPremiumPaid}</h3>
                <p>Premium Paid</p>
              </div>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎁</span>
              <div className="stat-content">
                <h3>{accountStats.totalPayoutsReceived}</h3>
                <p>Payouts Received</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Score</h2>
          <div className="score-container">
            <div className="score-circle">
              <div className="score-value">{accountStats.accountScore}</div>
              <div className="score-label">Account Score</div>
            </div>
            <div className="score-details">
              <h3>Score Breakdown</h3>
              <div className="score-item">
                <span>Payment History</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: '95%'}}></div>
                </div>
                <span>95%</span>
              </div>
              <div className="score-item">
                <span>Claim Accuracy</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: '80%'}}></div>
                </div>
                <span>80%</span>
              </div>
              <div className="score-item">
                <span>Account Activity</span>
                <div className="score-bar">
                  <div className="score-fill" style={{width: '75%'}}></div>
                </div>
                <span>75%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Notification Preferences</h2>
          <div className="notifications-grid">
            <div className="notification-item">
              <div className="notification-info">
                <h4>📧 Email Notifications</h4>
                <p>Policy updates, claims status, and important announcements</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={profile.notifications.email}
                  onChange={(e) => setProfile({
                    ...profile, 
                    notifications: {...profile.notifications, email: e.target.checked}
                  })}
                  disabled={!editing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="notification-item">
              <div className="notification-info">
                <h4>📱 SMS Notifications</h4>
                <p>Urgent alerts and claim approvals</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={profile.notifications.sms}
                  onChange={(e) => setProfile({
                    ...profile, 
                    notifications: {...profile.notifications, sms: e.target.checked}
                  })}
                  disabled={!editing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="notification-item">
              <div className="notification-info">
                <h4>🔔 Push Notifications</h4>
                <p>Real-time updates in your browser</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={profile.notifications.push}
                  onChange={(e) => setProfile({
                    ...profile, 
                    notifications: {...profile.notifications, push: e.target.checked}
                  })}
                  disabled={!editing}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Preferences</h2>
          <div className="preferences-grid">
            <div className="form-group">
              <label>Preferred Currency</label>
              {editing ? (
                <select 
                  value={profile.preferences.currency}
                  onChange={(e) => setProfile({
                    ...profile, 
                    preferences: {...profile.preferences, currency: e.target.value}
                  })}
                >
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              ) : (
                <p>{profile.preferences.currency}</p>
              )}
            </div>
            <div className="form-group">
              <label>Language</label>
              {editing ? (
                <select 
                  value={profile.preferences.language}
                  onChange={(e) => setProfile({
                    ...profile, 
                    preferences: {...profile.preferences, language: e.target.value}
                  })}
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              ) : (
                <p>{profile.preferences.language}</p>
              )}
            </div>
            <div className="form-group">
              <label>Timezone</label>
              {editing ? (
                <select 
                  value={profile.preferences.timezone}
                  onChange={(e) => setProfile({
                    ...profile, 
                    preferences: {...profile.preferences, timezone: e.target.value}
                  })}
                >
                  <option value="UTC-5">Eastern Time (UTC-5)</option>
                  <option value="UTC-6">Central Time (UTC-6)</option>
                  <option value="UTC-7">Mountain Time (UTC-7)</option>
                  <option value="UTC-8">Pacific Time (UTC-8)</option>
                </select>
              ) : (
                <p>{profile.preferences.timezone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section security-section">
          <h2>Security</h2>
          <div className="security-actions">
            <button className="btn-secondary">🔐 Change Password</button>
            <button className="btn-secondary">🔑 Enable 2FA</button>
            <button className="btn-secondary">📱 Manage Sessions</button>
            <button className="btn-danger">🗑️ Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;