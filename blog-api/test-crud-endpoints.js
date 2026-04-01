// Test all CRUD endpoints for blog posts
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

let authToken = '';
let createdPostId = '';

async function testCRUDEndpoints() {
  console.log('🧪 Testing Blog CRUD Endpoints\n');

  try {
    // 1. Register User
    console.log('1️⃣ Registering user...');
    const registerResponse = await axios.post(`${API_BASE}/register`, {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('✅ User registered:', registerResponse.data.user.username);

    // 2. Login User
    console.log('\n2️⃣ Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    authToken = loginResponse.data.token;
    console.log('✅ Login successful, token received');

    // 3. CREATE Post (POST)
    console.log('\n3️⃣ Creating post (POST)...');
    const createResponse = await axios.post(`${API_BASE}/posts`, {
      title: 'My First Blog Post',
      content: 'This is the content of my first blog post. It has sufficient length to pass validation.',
      tags: ['javascript', 'nodejs', 'express']
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    createdPostId = createResponse.data.post._id;
    console.log('✅ Post created:', createResponse.data.post.title);
    console.log('   Post ID:', createdPostId);

    // 4. GET All Posts (GET)
    console.log('\n4️⃣ Getting all posts (GET)...');
    const getAllResponse = await axios.get(`${API_BASE}/posts`);
    console.log('✅ All posts retrieved:', getAllResponse.data.posts.length, 'posts');

    // 5. GET Single Post (GET)
    console.log('\n5️⃣ Getting single post (GET)...');
    const getSingleResponse = await axios.get(`${API_BASE}/posts/${createdPostId}`);
    console.log('✅ Single post retrieved:', getSingleResponse.data.title);

    // 6. UPDATE Post (PUT)
    console.log('\n6️⃣ Updating post (PUT)...');
    const updateResponse = await axios.put(`${API_BASE}/posts/${createdPostId}`, {
      title: 'Updated Blog Post Title',
      content: 'This is the updated content of my blog post. It has been modified to test the PUT endpoint.',
      tags: ['updated', 'modified', 'blog']
    }, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Post updated:', updateResponse.data.post.title);

    // 7. GET User Posts (GET)
    console.log('\n7️⃣ Getting user posts (GET)...');
    const userPostsResponse = await axios.get(`${API_BASE}/user/posts`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ User posts retrieved:', userPostsResponse.data.posts.length, 'posts');

    // 8. DELETE Post (DELETE)
    console.log('\n8️⃣ Deleting post (DELETE)...');
    const deleteResponse = await axios.delete(`${API_BASE}/posts/${createdPostId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    console.log('✅ Post deleted:', deleteResponse.data.message);

    // 9. Verify Deletion
    console.log('\n9️⃣ Verifying deletion...');
    try {
      await axios.get(`${API_BASE}/posts/${createdPostId}`);
      console.log('❌ Post still exists (deletion failed)');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log('✅ Post successfully deleted');
      }
    }

    console.log('\n🎉 All CRUD endpoints tested successfully!');

  } catch (error) {
    console.error('❌ Error during testing:', error.response?.data || error.message);
  }
}

// Health check first
async function healthCheck() {
  try {
    const response = await axios.get(`${API_BASE}/health`);
    console.log('✅ Server is healthy:', response.data.status);
    return true;
  } catch (error) {
    console.error('❌ Server health check failed:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const isHealthy = await healthCheck();
  if (isHealthy) {
    await testCRUDEndpoints();
  }
}

runTests();
