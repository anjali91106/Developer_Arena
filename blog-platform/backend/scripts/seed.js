require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Sample data
const sampleUsers = [
  {
    username: 'emily_writes',
    email: 'emily@example.com',
    password: 'password123',
    bio: 'Passionate writer sharing thoughts on technology and life',
    avatar: 'https://ui-avatars.com/api/?name=Emily&background=ec4899&color=fff'
  },
  {
    username: 'tech_blogger',
    email: 'tech@example.com',
    password: 'password123',
    bio: 'Tech enthusiast and software developer',
    avatar: 'https://ui-avatars.com/api/?name=TechBlogger&background=a78bfa&color=fff'
  },
  {
    username: 'creative_mind',
    email: 'creative@example.com',
    password: 'password123',
    bio: 'Creative writer exploring art, design, and innovation',
    avatar: 'https://ui-avatars.com/api/?name=Creative&background=f472b6&color=fff'
  }
];

const samplePosts = [
  {
    title: 'Getting Started with React Hooks',
    content: 'React Hooks have revolutionized how we write React components. In this comprehensive guide, we\'ll explore useState, useEffect, and custom hooks. Learn how to write cleaner, more maintainable code with these powerful features.\n\nHooks allow you to use state and other React features without writing a class. They provide a more direct API to the React concepts you already know: state, lifecycle, context, and refs.',
    tags: ['react', 'javascript', 'web development'],
    author: 'emily_writes'
  },
  {
    title: 'The Future of Web Development',
    content: 'Web development is evolving rapidly with new frameworks and tools emerging. From AI-powered coding assistants to WebAssembly, the landscape is changing. In this post, we explore the trends shaping the future of web development and how developers can stay ahead of the curve.\n\nWe\'ll discuss topics like edge computing, progressive web apps, and the role of machine learning in modern web development.',
    tags: ['web development', 'technology', 'future'],
    author: 'tech_blogger'
  },
  {
    title: 'Finding Your Creative Voice',
    content: 'Every creative person struggles with finding their unique voice. Whether you\'re a writer, designer, or artist, authenticity is key. This post explores practical exercises and mindset shifts to help you discover and develop your authentic creative expression.\n\nWe\'ll cover topics like overcoming creative blocks, developing consistency, and building a personal brand that resonates with your audience.',
    tags: ['creativity', 'writing', 'personal development'],
    author: 'creative_mind'
  },
  {
    title: 'Building Scalable APIs with Node.js',
    content: 'Creating APIs that can handle millions of requests requires careful planning and architecture. In this technical deep-dive, we explore advanced Node.js patterns for building high-performance, scalable APIs.\n\nTopics include microservices architecture, database optimization strategies, caching techniques, and monitoring solutions for production environments.',
    tags: ['nodejs', 'api', 'backend', 'scalability'],
    author: 'tech_blogger'
  },
  {
    title: 'The Art of Minimalist Design',
    content: 'Less is more in design. Minimalist design isn\'t just about removing elements—it\'s about intentional choices that enhance user experience. Discover the principles of minimalist design and how to apply them to create beautiful, functional interfaces.\n\nLearn about whitespace, typography, color theory, and how to make every pixel count in your designs.',
    tags: ['design', 'ui/ux', 'minimalism'],
    author: 'creative_mind'
  }
];

const sampleComments = [
  {
    content: 'Great article! This really helped me understand React Hooks better.',
    author: 'tech_blogger',
    post: 0 // Will be updated with actual post ID
  },
  {
    content: 'I\'ve been struggling with finding my creative voice. These exercises are exactly what I needed!',
    author: 'emily_writes',
    post: 2 // Will be updated with actual post ID
  },
  {
    content: 'Scalability is so important for modern applications. Thanks for sharing these insights!',
    author: 'creative_mind',
    post: 3 // Will be updated with actual post ID
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      const savedUser = await user.save();
      createdUsers.push(savedUser);
      console.log(`Created user: ${savedUser.username}`);
    }

    // Create posts
    const createdPosts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const author = createdUsers.find(u => u.username === postData.author);
      
      if (author) {
        const post = new Post({
          ...postData,
          author: author._id,
          likeCount: Math.floor(Math.random() * 50) // Random like count
        });
        const savedPost = await post.save();
        createdPosts.push(savedPost);
        console.log(`Created post: ${savedPost.title}`);
      }
    }

    // Create comments
    for (let i = 0; i < sampleComments.length; i++) {
      const commentData = sampleComments[i];
      const author = createdUsers.find(u => u.username === commentData.author);
      const post = createdPosts[commentData.post];
      
      if (author && post) {
        const comment = new Comment({
          ...commentData,
          author: author._id,
          post: post._id
        });
        await comment.save();
        console.log(`Created comment by ${author.username} on post: ${post.title}`);
      }
    }

    console.log('Database seeded successfully!');
    console.log(`Created ${createdUsers.length} users, ${createdPosts.length} posts, and ${sampleComments.length} comments`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Connect to database and seed
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB for seeding');
    seedDatabase();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
