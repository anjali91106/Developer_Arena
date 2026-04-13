const Task = require('../models/Task');
const Joi = require('joi');

// Validation schemas
const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  status: Joi.string().valid('todo', 'in-progress', 'completed', 'cancelled').default('todo'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  category: Joi.string().valid('work', 'personal', 'shopping', 'health', 'education', 'finance', 'other').default('other'),
  tags: Joi.array().items(Joi.string().max(20)).max(10),
  dueDate: Joi.date().min('now').allow(null),
  estimatedTime: Joi.number().min(1).max(480).allow(null),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null)
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200),
  description: Joi.string().min(10).max(2000),
  status: Joi.string().valid('todo', 'in-progress', 'completed', 'cancelled'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  category: Joi.string().valid('work', 'personal', 'shopping', 'health', 'education', 'finance', 'other'),
  tags: Joi.array().items(Joi.string().max(20)).max(10),
  dueDate: Joi.date().min('now').allow(null),
  estimatedTime: Joi.number().min(1).max(480).allow(null),
  actualTime: Joi.number().min(0).allow(null),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).allow(null)
});

// Create Task
const createTask = async (req, res, next) => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message,
        field: error.details[0].path[0]
      });
    }

    const taskData = {
      ...req.body,
      user: req.user.id
    };

    const task = new Task(taskData);
    await task.save();
    await task.populate('user assignedTo', 'username firstName lastName');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (err) {
    console.error('Create task error:', err);
    next(err);
  }
};

// Get All Tasks (with filtering and pagination)
const getAllTasks = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      tags,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      dueDate,
      assignedTo
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter object
    const filter = { user: req.user.id };
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    if (dueDate) {
      if (dueDate === 'overdue') {
        filter.dueDate = { $lt: new Date(), status: { $ne: 'completed' } };
      } else if (dueDate === 'today') {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        filter.dueDate = { $lte: today };
      } else if (dueDate === 'upcoming') {
        filter.dueDate = { $gt: new Date() };
      }
    }
    if (assignedTo) filter.assignedTo = assignedTo;
    
    // Search functionality
    if (search) {
      filter.$text = {
        $search: search
      };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user assignedTo', 'username firstName lastName');

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      },
      filters: {
        status,
        priority,
        category,
        tags,
        search,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    console.error('Get tasks error:', err);
    next(err);
  }
};

// Get Single Task
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('user assignedTo', 'username firstName lastName');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user owns the task or is assigned to it
    if (task.user._id.toString() !== req.user.id && 
        task.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

// Update Task
const updateTask = async (req, res, next) => {
  try {
    const { error } = updateTaskSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: error.details[0].message,
        field: error.details[0].path[0]
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user owns the task
    if (task.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied - only task owner can update' });
    }

    // Update fields
    const allowedUpdates = ['title', 'description', 'status', 'priority', 'category', 'tags', 'dueDate', 'estimatedTime', 'actualTime', 'assignedTo'];
    const updates = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle status change to completed
    if (updates.status === 'completed' && task.status !== 'completed') {
      updates.completedAt = new Date();
    } else if (updates.status && updates.status !== 'completed') {
      updates.completedAt = null;
    }

    Object.assign(task, updates);
    task.updatedAt = new Date();
    await task.save();
    await task.populate('user assignedTo', 'username firstName lastName');

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (err) {
    console.error('Update task error:', err);
    next(err);
  }
};

// Delete Task
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user owns the task
    if (task.user._id.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied - only task owner can delete' });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Task deleted successfully'
    });
  } catch (err) {
    console.error('Delete task error:', err);
    next(err);
  }
};

// Get Task Statistics
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    const stats = await Task.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0]
            }
          },
          todo: {
            $sum: {
              $cond: [{ $eq: ['$status', 'todo'] }, 1, 0]
            }
          },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'completed'] },
                    { $lt: ['$dueDate', new Date()] },
                    { $ne: ['$dueDate', null] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const [overallStats, priorityStats, categoryStats] = stats;

    res.json({
      stats: {
        overall: overallStats[0] || {
          total: 0,
          completed: 0,
          inProgress: 0,
          todo: 0,
          overdue: 0
        },
        priority: priorityStats,
        category: categoryStats,
        completionRate: overallStats[0] ? 
          Math.round((overallStats[0].completed / overallStats[0].total) * 100) : 0
      }
    });
  } catch (err) {
    console.error('Get task stats error:', err);
    next(err);
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats
};
