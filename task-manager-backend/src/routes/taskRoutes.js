const express = require('express');
const router = express.Router();
const { 
  createTask, 
  getAllTasks, 
  getTaskById, 
  updateTask, 
  deleteTask, 
  getTaskStats 
} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');

// All routes are protected
router.use(authenticateToken);

// Task CRUD routes
router.post('/', createTask);
router.get('/', getAllTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
