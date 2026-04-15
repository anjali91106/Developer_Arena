const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  getUserProfile,
  updateProfile,
  getCurrentUser,
  getUserPosts
} = require('../controllers/userController');

// Public routes
router.get('/:userId', getUserProfile);
router.get('/:userId/posts', getUserPosts);

// Protected routes
router.get('/profile/current', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);

module.exports = router;
