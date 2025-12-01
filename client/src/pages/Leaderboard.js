import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import API_BASE_URL from '../config/api';
import './Leaderboard.css';

const Leaderboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('[Leaderboard] Token exists:', !!token);
      
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      console.log('[Leaderboard] Fetching from API...');
      const response = await fetch(`${API_BASE_URL}/api/leaderboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('[Leaderboard] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('[Leaderboard] Error response:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[Leaderboard] Data received:', data);

      if (data.success) {
        setUsers(data.users || []);
        setError('');
      } else {
        setError(data.message || 'Failed to load leaderboard');
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError('Error loading leaderboard: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Beginner': return '#95a5a6';
      case 'Bronze': return '#cd7f32';
      case 'Silver': return '#c0c0c0';
      case 'Gold': return '#ffd700';
      case 'Platinum': return '#e5e4e2';
      case 'Diamond': return '#b9f2ff';
      default: return '#95a5a6';
    }
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  return (
    <div className="leaderboard-page">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="leaderboard-content">
        <div className="leaderboard-header">
          <h1>Global Leaderboard</h1>
          <p>Top players ranked by battle rating</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={fetchLeaderboard}>Retry</button>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Section */}
            <div className="podium-section">
              <div className="podium-container">
                {/* 2nd Place */}
                {users[1] && (
                  <div className="podium-card second-place">
                    <div className="podium-rank">2</div>
                    <div className="podium-avatar">
                      {users[1].username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="podium-name">{users[1].username}</div>
                    <div className="podium-rating">
                      <span className="rating-badge">AP {users[1].rating || 500} points</span>
                    </div>
                    <div className="podium-prize">
                      ⚔️ {users[1].rating * 10} <br/> Prize
                    </div>
                  </div>
                )}

                {/* 1st Place */}
                {users[0] && (
                  <div className="podium-card first-place">
                    <div className="podium-rank">1</div>
                    <div className="podium-avatar">
                      {users[0].username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="podium-name">{users[0].username}</div>
                    <div className="podium-rating">
                      <span className="rating-badge">AP {users[0].rating || 500} points</span>
                    </div>
                    <div className="podium-prize">
                      ⚔️ {users[0].rating * 10} <br/> Prize
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {users[2] && (
                  <div className="podium-card third-place">
                    <div className="podium-rank">3</div>
                    <div className="podium-avatar">
                      {users[2].username?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="podium-name">{users[2].username}</div>
                    <div className="podium-rating">
                      <span className="rating-badge">AP {users[2].rating || 500} points</span>
                    </div>
                    <div className="podium-prize">
                      ⚔️ {users[2].rating * 10} <br/> Prize
                    </div>
                  </div>
                )}
              </div>

              {/* Stat Message */}
              <div className="stat-message">
                You earned ⚔️ {user?.totalPointsToday || 50} today and are ranked — out of {users.length} users
              </div>
            </div>

            {/* Table Section */}
            <div className="leaderboard-table-section">
              <div className="table-header">
                <h2>Top Users</h2>
                <button className="show-all-btn">Show all</button>
              </div>

              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Serial Number</th>
                      <th>User Address</th>
                      <th>24h Volume</th>
                      <th>User Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u.id || idx}>
                        <td>#{String(idx + 1).padStart(3, '0')}</td>
                        <td className="user-cell">
                          <span className="flag">{getCountryFlag(u.country)}</span>
                          <span className="username">{u.username}</span>
                        </td>
                        <td>${(u.rating * Math.random()).toFixed(2)} B</td>
                        <td className="address-cell">{formatAddress(u.email)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const getCountryFlag = (country) => {
  const flags = {
    'US': '🇺🇸',
    'IN': '🇮🇳',
    'CA': '🇨🇦',
    'UK': '🇬🇧',
    'DE': '🇩🇪',
    'FR': '🇫🇷',
    'JP': '🇯🇵',
    'AU': '🇦🇺'
  };
  return flags[country] || '🌍';
};

const formatAddress = (email) => {
  if (!email) return '0x...';
  return email.substring(0, 8) + '...' + email.substring(email.length - 4);
};

export default Leaderboard;
