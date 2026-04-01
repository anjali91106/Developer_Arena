const express = require('express');
const router = express.Router();
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getUserPosts
} = require('../controllers/postController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticateToken, createPost);
router.put('/:id', authenticateToken, updatePost);
router.delete('/:id', authenticateToken, deletePost);

module.exports = router;
