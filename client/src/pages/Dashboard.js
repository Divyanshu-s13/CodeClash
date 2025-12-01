import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaMapMarkerAlt, FaUniversity, FaLinkedin, FaGithub, FaInfoCircle, FaTrash, FaSave, FaLock, FaPencilAlt } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showCustomMode, setShowCustomMode] = useState(false);
  const [showAshesMode, setShowAshesMode] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    // Load from localStorage first, then from user object
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    return savedPhoto || user.profilePhoto || null;
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    country: user.country || '',
    organization: user.organization || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    about: user.about || ''
  });
  const [editFormData, setEditFormData] = useState({
    country: user.country || '',
    organization: user.organization || '',
    linkedin: user.linkedin || '',
    github: user.github || '',
    about: user.about || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Handle navigation from navbar Battle menu
  useEffect(() => {
    if (location.state?.showCustomMode) {
      setShowCustomMode(true);
      window.history.replaceState({}, document.title);
    }
    if (location.state?.showAshesMode) {
      setShowAshesMode(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file');
      return;
    }

    setUploadingPhoto(true);
    
    try {
      // Convert image to base64 for localStorage storage
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setPhotoError('Please log in again');
            setUploadingPhoto(false);
            return;
          }

          // Try to upload to backend
          const formData = new FormData();
          formData.append('profilePhoto', file);
          
          try {
            const response = await fetch('http://localhost:5001/api/users/upload-photo', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: formData
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.photoUrl) {
                // Use server URL
                setProfilePhoto(data.photoUrl);
                localStorage.setItem('userProfilePhoto', data.photoUrl);
                setPhotoError('');
                setUploadingPhoto(false);
                return;
              }
            }
          } catch (serverError) {
            console.log('Server upload failed, using local storage:', serverError);
          }

          // Fallback to localStorage with base64
          setProfilePhoto(base64Image);
          localStorage.setItem('userProfilePhoto', base64Image);
          setPhotoError('');
          setUploadingPhoto(false);
          
        } catch (err) {
          console.error('Photo processing error:', err);
          setPhotoError('Error processing photo. Please try again.');
          setUploadingPhoto(false);
        }
      };

      reader.onerror = () => {
        setPhotoError('Error reading file. Please try again.');
        setUploadingPhoto(false);
      };

      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Photo upload error:', err);
      setPhotoError(err.message || 'Error uploading photo. Please try again.');
      setUploadingPhoto(false);
    }
  };

  const handleEditProfileClick = () => {
    setShowEditProfile(true);
    setEditFormData({
      country: userProfile.country,
      organization: userProfile.organization,
      linkedin: userProfile.linkedin,
      github: userProfile.github,
      about: userProfile.about
    });
    setProfileError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    setProfileError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setProfileError('Please log in again');
        setSavingProfile(false);
        return;
      }

      // Update local state immediately for better UX
      setUserProfile(editFormData);
      
      // Also update the user object for consistency
      user.country = editFormData.country;
      user.organization = editFormData.organization;
      user.linkedin = editFormData.linkedin;
      user.github = editFormData.github;
      user.about = editFormData.about;
      
      // Save to localStorage for persistence
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      Object.assign(storedUser, editFormData);
      localStorage.setItem('user', JSON.stringify(storedUser));

      try {
        // Try to update on backend
        const response = await fetch('http://localhost:5001/api/users/update-profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editFormData)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log('Backend update failed:', errorData.message);
          // Don't throw error - we already saved locally
        } else {
          const data = await response.json();
          if (!data.success) {
            console.log('Backend update unsuccessful:', data.message);
          }
        }
      } catch (serverError) {
        console.log('Server not available, using local storage:', serverError);
        // Continue - we already saved to localStorage
      }

      setShowEditProfile(false);
      setProfileError('');
      
    } catch (err) {
      console.error('Profile update error:', err);
      setProfileError(err.message || 'Error updating profile. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePhotoUploadInModal = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setProfileError('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file');
      return;
    }

    setUploadingPhoto(true);
    setProfileError('');
    
    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64Image = event.target.result;
        
        try {
          const token = localStorage.getItem('token');
          const formData = new FormData();
          formData.append('profilePhoto', file);
          
          try {
            const response = await fetch('http://localhost:5001/api/users/upload-photo', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`
              },
              body: formData
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success && data.photoUrl) {
                setProfilePhoto(data.photoUrl);
                localStorage.setItem('userProfilePhoto', data.photoUrl);
                setUploadingPhoto(false);
                return;
              }
            }
          } catch (serverError) {
            console.log('Server upload failed, using local storage:', serverError);
          }

          // Fallback to localStorage
          setProfilePhoto(base64Image);
          localStorage.setItem('userProfilePhoto', base64Image);
          setUploadingPhoto(false);
          
        } catch (err) {
          console.error('Photo processing error:', err);
          setProfileError('Error processing photo');
          setUploadingPhoto(false);
        }
      };

      reader.onerror = () => {
        setProfileError('Error reading file');
        setUploadingPhoto(false);
      };

      reader.readAsDataURL(file);
      
    } catch (err) {
      console.error('Photo upload error:', err);
      setProfileError('Error uploading photo');
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="dashboard-container">
        <div className="dashboard-content">
          {/* Left Sidebar - User Profile */}
          <div className="dashboard-sidebar">
            <div className="profile-card">
              <div className="profile-avatar-large">
                {profilePhoto ? (
                  <img src={profilePhoto} alt={user.username} className="profile-photo-img" />
                ) : (
                  user.username?.charAt(0).toUpperCase() || '?'
                )}
              </div>
              <div className="profile-info">
                <h2 className="profile-name">{user.username}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
              <div className="profile-rank">
                <span className="rank-label">Rank</span>
                <span className="rank-value">{user.rank || 'Unranked'}</span>
              </div>
              <button className="edit-profile-btn" onClick={handleEditProfileClick}><FaPencilAlt /> Edit Profile</button>
              
              {/* About Section */}
              <div className="about-section">
                <h3 className="about-heading"><FaInfoCircle /> About</h3>
                <p className="about-text">
                  {userProfile.about || 'No bio added yet. Click Edit Profile to add information about yourself.'}
                </p>
              </div>

              <div className="profile-meta">
                <div className="meta-item">
                  <span className="meta-icon"><FaMapMarkerAlt /></span>
                  <span className="meta-text">{userProfile.country || 'Not specified'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon"><FaUniversity /></span>
                  <span className="meta-text">{userProfile.organization || 'Not specified'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon"><FaLinkedin /></span>
                  <span className="meta-text">
                    {userProfile.linkedin ? (
                      <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer" className="profile-link">
                        {userProfile.linkedin.replace(/^https?:\/\/(www\.)?/, '').substring(0, 25)}...
                      </a>
                    ) : (
                      'Not linked'
                    )}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-icon"><FaGithub /></span>
                  <span className="meta-text">
                    {userProfile.github ? (
                      <a href={userProfile.github} target="_blank" rel="noopener noreferrer" className="profile-link">
                        {userProfile.github.replace(/^https?:\/\/(www\.)?/, '').substring(0, 25)}...
                      </a>
                    ) : (
                      'Not linked'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Badges Section */}
            <div className="badges-section-sidebar">
              <h3 className="badges-heading">Badges</h3>
              <div className="badges-count-sidebar">{user.badges || 0}</div>
              <div className="badges-list-sidebar">
                <div className="badge-item-sidebar locked">
                  <div className="badge-icon-sidebar"><FaLock /></div>
                  <span className="badge-text">Feb LeetCoding Challenge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="dashboard-main">
            <div className="dashboard-header">
              <h1>Welcome, {user.username}!</h1>
            </div>

            {/* Solved Problems Section */}
            <div className="problems-section">
              <div className="problems-header">
                <h2>Solved Problems</h2>
              </div>
              <div className="problems-stats">
                <div className="problem-stat">
                  <div className="stat-circle">
                    <svg viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="#2a2d33" strokeWidth="8"/>
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="54" 
                        fill="none" 
                        stroke="#1abc9c" 
                        strokeWidth="8"
                        strokeDasharray={`${(user.easyProblems || 129) * 3.4} 339`}
                        style={{transform: 'rotate(-90deg)', transformOrigin: '60px 60px'}}
                      />
                    </svg>
                    <div className="stat-text">{user.totalProblems || 0}<br/><span>Solved</span></div>
                  </div>
                </div>

                <div className="difficulty-stats">
                  <div className="difficulty-row">
                    <span className="difficulty-label">Battles Fought</span>
                    <div className="progress-bar">
                      <div className="progress-fill easy" style={{width: `${Math.min((user.battlesFought || 0) * 10, 100)}%`}}></div>
                    </div>
                    <span className="difficulty-count">{user.battlesFought || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showCustomMode && (
          <CustomModeModal 
            user={user}
            onClose={() => setShowCustomMode(false)}
            navigate={navigate}
            onShowCreate={() => {
              setShowCreateRoom(true);
              setShowJoinRoom(false);
            }}
            onShowJoin={() => {
              setShowJoinRoom(true);
              setShowCreateRoom(false);
            }}
            showCreateRoom={showCreateRoom}
            showJoinRoom={showJoinRoom}
            setShowCreateRoom={setShowCreateRoom}
            setShowJoinRoom={setShowJoinRoom}
          />
        )}

        {showAshesMode && (
          <AshesModeModal 
            user={user}
            onClose={() => setShowAshesMode(false)}
            navigate={navigate}
          />
        )}

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="modal-overlay" onClick={() => setShowEditProfile(false)}>
            <div className="modal-content edit-profile-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>✏️ Edit Profile</h2>
                <button className="close-btn" onClick={() => setShowEditProfile(false)}>✕</button>
              </div>

              <div className="modal-body">
                {profileError && (
                  <div className="error-message">{profileError}</div>
                )}

                {/* Profile Photo Section */}
                <div className="edit-photo-section">
                  <label className="edit-section-label">Profile Photo</label>
                  <div className="edit-photo-container">
                    <div className="edit-avatar-preview">
                      {profilePhoto ? (
                        <img src={profilePhoto} alt="Profile" className="profile-photo-img" />
                      ) : (
                        user.username?.charAt(0).toUpperCase() || '?'
                      )}
                    </div>
                    <div className="edit-photo-actions">
                      <label htmlFor="modal-photo-input" className="upload-photo-btn">
                        {uploadingPhoto ? 'Uploading...' : '📷 Change Photo'}
                      </label>
                      <input
                        id="modal-photo-input"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUploadInModal}
                        disabled={uploadingPhoto}
                        className="photo-input-hidden"
                      />
                      {profilePhoto && (
                        <button 
                          className="remove-photo-btn"
                          onClick={() => {
                            setProfilePhoto(null);
                            localStorage.removeItem('userProfilePhoto');
                          }}
                        >
                          <FaTrash /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="edit-form-section">
                  <div className="form-group">
                    <label htmlFor="country"><FaMapMarkerAlt /> Location / Country</label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={editFormData.country}
                      onChange={handleInputChange}
                      placeholder="e.g., India, United States"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="organization"><FaUniversity /> College / Organization</label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      value={editFormData.organization}
                      onChange={handleInputChange}
                      placeholder="e.g., NIT Agartala"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="linkedin"><FaLinkedin /> LinkedIn Profile</label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={editFormData.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="github"><FaGithub /> GitHub Profile</label>
                    <input
                      type="url"
                      id="github"
                      name="github"
                      value={editFormData.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/username"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="about"><FaInfoCircle /> About Me</label>
                    <textarea
                      id="about"
                      name="about"
                      value={editFormData.about}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself, your interests, and goals..."
                      className="form-textarea"
                      rows="4"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="modal-actions">
                  <button 
                    className="cancel-btn"
                    onClick={() => setShowEditProfile(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="save-btn"
                    onClick={handleSaveProfile}
                    disabled={savingProfile}
                  >
                    {savingProfile ? 'Saving...' : <><FaSave /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CustomModeModal = ({ user, onClose, navigate, onShowCreate, onShowJoin, showCreateRoom, showJoinRoom, setShowCreateRoom, setShowJoinRoom }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mode-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚔️ Custom Mode</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <p className="mode-description">Create your own room or join an existing one to battle with friends!</p>
          
          <div className="room-buttons">
            <button 
              className="room-btn create-btn"
              onClick={onShowCreate}
            >
              ➕ Create Room
            </button>
            <button 
              className="room-btn join-btn"
              onClick={onShowJoin}
            >
              🚪 Join Room
            </button>
          </div>

          {showCreateRoom && (
            <CreateRoomModal 
              user={user}
              onClose={() => setShowCreateRoom(false)}
              navigate={navigate}
            />
          )}

          {showJoinRoom && (
            <JoinRoomModal 
              user={user}
              onClose={() => setShowJoinRoom(false)}
              navigate={navigate}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const AshesModeModal = ({ user, onClose, navigate }) => {
  const [inQueue, setInQueue] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [queuePosition, setQueuePosition] = useState(null);
  const [matchFound, setMatchFound] = useState(false);
  const pollIntervalRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      // Cleanup: leave queue if modal closes while in queue
      if (inQueue && pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        leaveQueue();
      }
    };
  }, [inQueue]);

  const joinQueue = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in again');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/matchmaking/queue/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        if (data.matched) {
          // Immediate match found
          setMatchFound(true);
          setTimeout(() => {
            navigate(`/battle/${data.roomCode}`);
          }, 2000);
        } else {
          // Added to queue, start polling
          setInQueue(true);
          setQueuePosition(data.queuePosition);
          startPolling();
        }
      } else {
        setError(data.message || 'Failed to join queue');
      }
    } catch (err) {
      setError('Error joining queue: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const leaveQueue = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      await fetch('http://localhost:5001/api/matchmaking/queue/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      setInQueue(false);
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    } catch (err) {
      console.error('Error leaving queue:', err);
    }
  };

  const startPolling = () => {
    pollIntervalRef.current = setInterval(async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          clearInterval(pollIntervalRef.current);
          return;
        }

        const response = await fetch('http://localhost:5001/api/matchmaking/queue/status', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          if (data.status === 'matched') {
            // Match found!
            clearInterval(pollIntervalRef.current);
            setMatchFound(true);
            setTimeout(() => {
              navigate(`/battle/${data.roomCode}`);
            }, 2000);
          } else {
            // Update queue position
            setQueuePosition(data.queuePosition);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000); // Poll every 2 seconds
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content mode-modal ashes-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔥 Ashes Mode</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          
          {!inQueue && !matchFound && (
            <>
              <p className="mode-description">
                Enter the ranked queue and get matched with players of similar skill level!
              </p>
              <div className="ashes-info">
                <p>🎯 Rating Range: ±200</p>
                <p>⚡ Fast Matchmaking</p>
                <p>🏆 Competitive Battles</p>
              </div>
              <button 
                className="queue-btn join-queue-btn"
                onClick={joinQueue}
                disabled={loading}
              >
                {loading ? 'Joining Queue...' : '🔥 Join Queue'}
              </button>
            </>
          )}

          {inQueue && !matchFound && (
            <div className="queue-status">
              <div className="queue-animation">
                <div className="spinner"></div>
              </div>
              <h3>Searching for Opponent...</h3>
              <p className="queue-position">Position in queue: #{queuePosition}</p>
              <p className="queue-message">Looking for players with rating {user.rating - 200} - {user.rating + 200}</p>
              <button 
                className="queue-btn leave-queue-btn"
                onClick={leaveQueue}
              >
                Leave Queue
              </button>
            </div>
          )}

          {matchFound && (
            <div className="match-found">
              <div className="match-animation">
                <div className="checkmark">✓</div>
              </div>
              <h3>Match Found!</h3>
              <p>Preparing battle arena...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateRoomModal = ({ user, onClose, navigate }) => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in again');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to room page immediately
        navigate(`/room/${data.room.code}`);
      } else {
        if (data.message === 'Not authorized to access this route') {
          setError('Session expired. Please log out and log back in.');
        } else {
          setError(data.message || 'Failed to create room');
        }
      }
    } catch (err) {
      setError('Error creating room: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    alert('Room code copied to clipboard!');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Room</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-body">
          <p>Click the button below to create a new room:</p>
          <button 
            className="create-room-btn"
            onClick={handleCreateRoom}
            disabled={loading}
          >
            {loading ? 'Creating Room...' : 'Generate Room Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

const JoinRoomModal = ({ user, onClose, navigate }) => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in again');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5001/api/rooms/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: roomCode })
      });

      const data = await response.json();

      if (data.success) {
        // Navigate to room page
        navigate(`/room/${roomCode}`);
      } else {
        if (data.message === 'Not authorized to access this route') {
          setError('Session expired. Please log out and log back in.');
        } else {
          setError(data.message || 'Failed to join room');
        }
      }
    } catch (err) {
      setError('Error joining room: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Join Room</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="modal-body">
          <p>Enter the 6-digit room code to join:</p>
          <input
            type="text"
            maxLength="6"
            placeholder="000000"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, ''))}
            className="room-code-input"
          />
          <button 
            className="join-room-btn"
            onClick={handleJoinRoom}
            disabled={loading || roomCode.length !== 6}
          >
            {loading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
