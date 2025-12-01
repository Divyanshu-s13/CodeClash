const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route GET /api/users/search
// @desc Search users by username
// @access Private
router.get('/search', protect, async (req, res) => {
  try {
    const { username } = req.query;
    console.log('[Search] Request received for username:', username);
    console.log('[Search] User ID from token:', req.userId);

    if (!username || username.trim().length < 1) {
      console.log('[Search] Invalid username length');
      return res.status(400).json({ 
        success: false, 
        message: 'Username must be at least 1 character' 
      });
    }

    // Search for users with username matching the query (case-insensitive)
    const users = await User.find({
      username: { $regex: username, $options: 'i' }
    })
    .select('username email rating tier battlesFought')
    .limit(10)
    .sort({ rating: -1 });

    console.log('[Search] Found users:', users.length);

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('[Search] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
