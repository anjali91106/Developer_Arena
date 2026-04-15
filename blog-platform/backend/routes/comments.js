const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middlewares/auth');
const {
  addComment,
  getCommentsByPost,
  updateComment,
  deleteComment
} = require('../controllers/commentController');

// Public routes
router.get('/post/:postId', getCommentsByPost);

// Protected routes
router.post('/post/:postId', authenticateToken, addComment);
router.put('/:commentId', authenticateToken, updateComment);
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;
