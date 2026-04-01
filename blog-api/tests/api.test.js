const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

describe('Blog API', () => {
  beforeAll(async () => {
    // Test database connection
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/blog-api-test');
  });

  afterAll(async () => {
    // Close database connection
    await mongoose.connection.close();
  });

  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.username).toBe(userData.username);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('email');
    });
  });

  describe('POST /api/login', () => {
    it('should login existing user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
    });

    it('should not login with wrong password', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/posts', () => {
    it('should get all posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body.posts).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('POST /api/posts', () => {
    it('should create a new post with valid token', async () => {
      // First login to get token
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const postData = {
        title: 'Test Post',
        content: 'This is a test post content with sufficient length.',
        tags: ['test', 'api']
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send(postData)
        .expect(201);

      expect(response.body.message).toBe('Post created successfully');
      expect(response.body.post.title).toBe(postData.title);
    });

    it('should not create post without token', async () => {
      const postData = {
        title: 'Test Post',
        content: 'This is a test post content with sufficient length.'
      };

      const response = await request(app)
        .post('/api/posts')
        .send(postData)
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('GET /api/posts/:id', () => {
    it('should get a single post', async () => {
      // Create a post first
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Post for Get',
          content: 'This is a test post content for get endpoint.'
        });

      const postId = postResponse.body.post._id;

      const response = await request(app)
        .get(`/api/posts/${postId}`)
        .expect(200);

      expect(response.body.title).toBe('Test Post for Get');
    });
  });

  describe('PUT /api/posts/:id', () => {
    it('should update a post with valid token', async () => {
      // Login and create post
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Original Title',
          content: 'Original content.'
        });

      const postId = postResponse.body.post._id;

      const updateData = {
        title: 'Updated Title',
        content: 'Updated content.'
      };

      const response = await request(app)
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.message).toBe('Post updated successfully');
      expect(response.body.post.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/posts/:id', () => {
    it('should delete a post with valid token', async () => {
      // Login and create post
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const postResponse = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Post to Delete',
          content: 'This post will be deleted.'
        });

      const postId = postResponse.body.post._id;

      const response = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Post deleted successfully');
    });
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.uptime).toBeDefined();
    });
  });
});
