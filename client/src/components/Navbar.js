import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import codeClashLogo from '../assets/codeClashLogo.png';
import codeClashTitle from '../assets/codeClashTitle.png';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfile, setShowProfile] = useState(false);
  const [showBattleMenu, setShowBattleMenu] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem('userProfilePhoto') || user.profilePhoto || null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const battleMenuRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Listen for profile photo changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newPhoto = localStorage.getItem('userProfilePhoto');
      if (newPhoto !== profilePhoto) {
        setProfilePhoto(newPhoto);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically in case same-tab updates don't trigger storage event
    const interval = setInterval(() => {
      const currentPhoto = localStorage.getItem('userProfilePhoto');
      if (currentPhoto !== profilePhoto) {
        setProfilePhoto(currentPhoto);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [profilePhoto]);

  // Close battle menu when clicking outside
  useEffect(() => {
    if (!showBattleMenu) return;

    const handleClickOutside = (event) => {
      if (battleMenuRef.current && !battleMenuRef.current.contains(event.target)) {
        setShowBattleMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showBattleMenu]);

  // Close search results when clicking outside
  useEffect(() => {
    if (!showSearchResults) return;

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSearchResults]);

  // Search users with debounce
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.trim().length < 1) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    // Show loading state
    setIsSearching(true);
    setShowSearchResults(true);

    // Debounce search - wait 300ms after user stops typing
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('[Search] Searching for:', query);
        console.log('[Search] Token exists:', !!token);
        
        const response = await fetch(`http://localhost:5001/api/users/search?username=${encodeURIComponent(query)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('[Search] Response status:', response.status);
        const data = await response.json();
        console.log('[Search] Response data:', data);
        
        if (data.success && data.users) {
          setSearchResults(data.users);
          console.log('[Search] Found users:', data.users.length);
        } else {
          setSearchResults([]);
          console.log('[Search] No users found or error:', data.message);
        }
      } catch (error) {
        console.error('[Search] Error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  const handleUserClick = (username) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearchResults(false);
    setIsSearching(false);
    navigate(`/profile/${username}`);
  };

  if (!user) {
    return null;
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

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

  const handleCustomMode = () => {
    setShowBattleMenu(false);
    navigate('/dashboard', { state: { showCustomMode: true } });
  };

  const handleAshesMode = () => {
    setShowBattleMenu(false);
    navigate('/dashboard', { state: { showAshesMode: true } });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <div className="navbar-logo">
            <img src={codeClashLogo} alt="CodeClash" className="navbar-logo-image" />
            <img src={codeClashTitle} alt="CodeClash" className="navbar-logo-title" />
          </div>
          
          <div className="navbar-links">
            <button 
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </button>

            <div className="battle-menu-container" ref={battleMenuRef}>
              <button 
                className={`nav-link battle-btn ${showBattleMenu ? 'active' : ''}`}
                onClick={() => setShowBattleMenu(!showBattleMenu)}
              >
                Battle
              </button>

              {showBattleMenu && (
                <div className="battle-menu-dropdown">
                  <button 
                    className="battle-mode-option"
                    onClick={handleCustomMode}
                  >
                    Custom Mode
                  </button>
                  <button 
                    className="battle-mode-option"
                    onClick={handleAshesMode}
                  >
                    Ashes Mode
                  </button>
                </div>
              )}
            </div>

            <button 
              className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}
              onClick={() => navigate('/leaderboard')}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-search" ref={searchRef}>
            <input
              type="text"
              className="search-input"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 1 && setShowSearchResults(true)}
            />
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" strokeWidth="2"/>
            </svg>
            
            {showSearchResults && isSearching && (
              <div className="search-results-dropdown">
                <div className="search-loading">Searching...</div>
              </div>
            )}
            
            {showSearchResults && !isSearching && searchResults.length > 0 && (
              <div className="search-results-dropdown">
                {searchResults.map((result) => (
                  <div 
                    key={result._id} 
                    className="search-result-item"
                    onClick={() => handleUserClick(result.username)}
                  >
                    <div className="search-result-avatar">
                      {result.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="search-result-info">
                      <div className="search-result-username">{result.username}</div>
                      <div className="search-result-stats">
                        <span className="search-result-rating">Rating: {result.rating}</span>
                        <span className="search-result-tier">{result.tier}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showSearchResults && !isSearching && searchQuery.trim().length >= 1 && searchResults.length === 0 && (
              <div className="search-results-dropdown">
                <div className="search-no-results">No users found</div>
              </div>
            )}
          </div>

          <div className="navbar-user">
            <div className="user-rating">
              {user.rating || 800}
            </div>
          </div>

          <div 
            className="user-profile-avatar"
            onClick={() => setShowProfile(true)}
            title={user.username}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt={user.username} className="profile-avatar-img" />
            ) : (
              user.username ? user.username.charAt(0).toUpperCase() : '?'
            )}
          </div>

          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      {showProfile && (
        <div className="modal-overlay" onClick={() => setShowProfile(false)}>
          <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Profile</h2>
              <button className="close-btn" onClick={() => setShowProfile(false)}>✕</button>
            </div>

            <div className="profile-modal-body">
              <div className="profile-avatar-large">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={user.username} className="profile-avatar-img" />
                ) : (
                  user.username ? user.username.charAt(0).toUpperCase() : '?'
                )}
              </div>

              <div className="profile-info-grid">
                <div className="profile-info-item">
                  <span className="profile-label">Username</span>
                  <span className="profile-value">{user.username || 'Unknown'}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-label">Email</span>
                  <span className="profile-value">{user.email || 'N/A'}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-label">User ID</span>
                  <span className="profile-value">{user.id || 'N/A'}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-label">Battle Rating</span>
                  <span className="profile-value rating">{user.rating || 800}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-label">Battles Fought</span>
                  <span className="profile-value">{user.battlesFought || 0}</span>
                </div>

                <div className="profile-info-item">
                  <span className="profile-label">Tier</span>
                  <span 
                    className="profile-value tier"
                    style={{ color: getTierColor(user.tier || 'Beginner') }}
                  >
                    {user.tier || 'Beginner'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-modal-footer">
              <button 
                className="show-stats-btn"
                onClick={() => {
                  setShowProfile(false);
                  navigate('/stats');
                }}
              >
                📊 Show Me My Stats
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
