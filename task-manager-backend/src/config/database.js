const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcryptjs');

// Database configuration
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://anjalisoni86904_db_user:JepnWD1Rvl4C6n1M@cluster0.qqajdwn.mongodb.net/?appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Clear all data
const clearDatabase = async () => {
  try {
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

// Seed dummy data
const seedDatabase = async () => {
  try {
    console.log('Seeding database with dummy data...');

    // Clear existing data
    await clearDatabase();

    // Create dummy users
    const users = await createDummyUsers();
    
    // Create dummy tasks
    await createDummyTasks(users);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users and ${await Task.countDocuments()} tasks`);
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Create dummy users
const createDummyUsers = async () => {
  const dummyUsers = [
    {
      username: 'john_doe',
      email: 'john.doe@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      username: 'jane_smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      firstName: 'Jane',
      lastName: 'Smith',
      avatar: 'https://i.pravatar.cc/150?img=5'
    },
    {
      username: 'mike_wilson',
      email: 'mike.wilson@example.com',
      password: 'password123',
      firstName: 'Mike',
      lastName: 'Wilson',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      username: 'sarah_jones',
      email: 'sarah.jones@example.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Jones',
      avatar: 'https://i.pravatar.cc/150?img=9'
    },
    {
      username: 'alex_brown',
      email: 'alex.brown@example.com',
      password: 'password123',
      firstName: 'Alex',
      lastName: 'Brown',
      avatar: 'https://i.pravatar.cc/150?img=7'
    }
  ];

  const createdUsers = [];
  for (const userData of dummyUsers) {
    const user = new User(userData);
    await user.save();
    createdUsers.push(user);
  }

  console.log(`Created ${createdUsers.length} dummy users`);
  return createdUsers;
};

// Create dummy tasks
const createDummyTasks = async (users) => {
  const dummyTasks = [
    // John's tasks
    {
      title: 'Complete project documentation',
      description: 'Write comprehensive documentation for the task manager API including all endpoints, examples, and best practices.',
      status: 'in-progress',
      priority: 'high',
      category: 'work',
      tags: ['documentation', 'api', 'urgent'],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      estimatedTime: 180,
      actualTime: 45,
      user: users[0]._id,
      assignedTo: users[1]._id
    },
    {
      title: 'Review pull requests',
      description: 'Review and approve pending pull requests from team members.',
      status: 'todo',
      priority: 'medium',
      category: 'work',
      tags: ['code-review', 'team'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      estimatedTime: 60,
      user: users[0]._id
    },
    {
      title: 'Update dependencies',
      description: 'Update all npm packages to latest stable versions and test compatibility.',
      status: 'completed',
      priority: 'low',
      category: 'work',
      tags: ['maintenance', 'dependencies'],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      estimatedTime: 45,
      actualTime: 30,
      user: users[0]._id,
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
    },
    {
      title: 'Buy groceries',
      description: 'Get groceries for the week including vegetables, fruits, and dairy products.',
      status: 'todo',
      priority: 'medium',
      category: 'shopping',
      tags: ['groceries', 'weekly'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      estimatedTime: 90,
      user: users[0]._id
    },

    // Jane's tasks
    {
      title: 'Design new dashboard',
      description: 'Create wireframes and mockups for the new analytics dashboard.',
      status: 'in-progress',
      priority: 'high',
      category: 'work',
      tags: ['design', 'dashboard', 'ui'],
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
      estimatedTime: 240,
      actualTime: 120,
      user: users[1]._id
    },
    {
      title: 'Team meeting preparation',
      description: 'Prepare slides and agenda for the weekly team sync meeting.',
      status: 'todo',
      priority: 'medium',
      category: 'work',
      tags: ['meeting', 'team', 'presentation'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      estimatedTime: 60,
      user: users[1]._id
    },
    {
      title: 'Yoga class',
      description: 'Attend evening yoga class for stress relief and flexibility.',
      status: 'completed',
      priority: 'low',
      category: 'health',
      tags: ['exercise', 'wellness'],
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      estimatedTime: 60,
      actualTime: 60,
      user: users[1]._id,
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Pay utility bills',
      description: 'Pay electricity, water, and internet bills for this month.',
      status: 'todo',
      priority: 'high',
      category: 'finance',
      tags: ['bills', 'monthly'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      estimatedTime: 30,
      user: users[1]._id
    },

    // Mike's tasks
    {
      title: 'Fix authentication bug',
      description: 'Investigate and fix the JWT token expiration issue reported by users.',
      status: 'in-progress',
      priority: 'urgent',
      category: 'work',
      tags: ['bug', 'authentication', 'jwt'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      estimatedTime: 120,
      actualTime: 75,
      user: users[2]._id
    },
    {
      title: 'Database optimization',
      description: 'Optimize database queries and add proper indexes for better performance.',
      status: 'todo',
      priority: 'medium',
      category: 'work',
      tags: ['database', 'performance', 'optimization'],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      estimatedTime: 180,
      user: users[2]._id
    },
    {
      title: 'Gym workout',
      description: 'Complete upper body workout routine at the gym.',
      status: 'completed',
      priority: 'medium',
      category: 'health',
      tags: ['exercise', 'gym', 'fitness'],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      estimatedTime: 90,
      actualTime: 85,
      user: users[2]._id,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Read technical book',
      description: 'Read "Clean Code" by Robert Martin and take notes.',
      status: 'in-progress',
      priority: 'low',
      category: 'education',
      tags: ['reading', 'learning', 'programming'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
      estimatedTime: 300,
      actualTime: 45,
      user: users[2]._id
    },

    // Sarah's tasks
    {
      title: 'Client presentation',
      description: 'Prepare and deliver presentation for the new client project.',
      status: 'todo',
      priority: 'high',
      category: 'work',
      tags: ['presentation', 'client', 'important'],
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      estimatedTime: 180,
      user: users[3]._id,
      assignedTo: users[4]._id
    },
    {
      title: 'Market research',
      description: 'Research competitor products and market trends for Q2 planning.',
      status: 'in-progress',
      priority: 'medium',
      category: 'work',
      tags: ['research', 'market', 'planning'],
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      estimatedTime: 240,
      actualTime: 90,
      user: users[3]._id
    },
    {
      title: 'Doctor appointment',
      description: 'Annual health checkup and blood test.',
      status: 'completed',
      priority: 'medium',
      category: 'health',
      tags: ['health', 'appointment'],
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      estimatedTime: 120,
      actualTime: 150,
      user: users[3]._id,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Plan vacation',
      description: 'Research and book flights and hotel for summer vacation.',
      status: 'todo',
      priority: 'low',
      category: 'personal',
      tags: ['vacation', 'travel', 'planning'],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
      estimatedTime: 180,
      user: users[3]._id
    },

    // Alex's tasks
    {
      title: 'API integration',
      description: 'Integrate third-party payment API into the application.',
      status: 'in-progress',
      priority: 'high',
      category: 'work',
      tags: ['api', 'integration', 'payment'],
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      estimatedTime: 240,
      actualTime: 100,
      user: users[4]._id
    },
    {
      title: 'Code review',
      description: 'Review and provide feedback on team members\' code submissions.',
      status: 'todo',
      priority: 'medium',
      category: 'work',
      tags: ['code-review', 'team', 'quality'],
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
      estimatedTime: 90,
      user: users[4]._id
    },
    {
      title: 'Learn new framework',
      description: 'Complete online course on React and Next.js.',
      status: 'in-progress',
      priority: 'low',
      category: 'education',
      tags: ['learning', 'react', 'nextjs'],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 3 weeks from now
      estimatedTime: 600,
      actualTime: 180,
      user: users[4]._id
    },
    {
      title: 'Home renovation',
      description: 'Paint living room walls and install new shelves.',
      status: 'todo',
      priority: 'medium',
      category: 'personal',
      tags: ['home', 'renovation', 'diy'],
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      estimatedTime: 300,
      user: users[4]._id
    },

    // Overdue tasks
    {
      title: 'Submit expense report',
      description: 'Submit last month\'s expense report with all receipts.',
      status: 'todo',
      priority: 'high',
      category: 'finance',
      tags: ['expenses', 'report', 'overdue'],
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
      estimatedTime: 45,
      user: users[0]._id
    },
    {
      title: 'Server maintenance',
      description: 'Perform routine server maintenance and security updates.',
      status: 'in-progress',
      priority: 'urgent',
      category: 'work',
      tags: ['server', 'maintenance', 'security'],
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (overdue)
      estimatedTime: 120,
      actualTime: 60,
      user: users[2]._id
    }
  ];

  const createdTasks = [];
  for (const taskData of dummyTasks) {
    const task = new Task(taskData);
    await task.save();
    createdTasks.push(task);
  }

  console.log(`Created ${createdTasks.length} dummy tasks`);
  return createdTasks;
};

// Get database statistics
const getDatabaseStats = async () => {
  try {
    const userCount = await User.countDocuments();
    const taskCount = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const overdueTasks = await Task.countDocuments({ 
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });

    const stats = {
      users: userCount,
      tasks: taskCount,
      completedTasks,
      overdueTasks,
      completionRate: taskCount > 0 ? Math.round((completedTasks / taskCount) * 100) : 0
    };

    console.log('Database Statistics:', stats);
    return stats;
  } catch (error) {
    console.error('Error getting database stats:', error);
  }
};

// Export functions
module.exports = {
  connectDB,
  clearDatabase,
  seedDatabase,
  createDummyUsers,
  createDummyTasks,
  getDatabaseStats
};
