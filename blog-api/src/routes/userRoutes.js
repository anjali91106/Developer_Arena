const express = require('express');
const router = express.Router();
const { getUserPosts } = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');

// User-specific routes
router.get('/posts', authenticateToken, getUserPosts);

module.exports = router;
