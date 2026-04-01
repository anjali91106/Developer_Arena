// Simple CRUD Test - Handles existing users
const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

async function testCRUD() {
  console.log('🧪 Simple CRUD Test\n');

  try {
    // 1. Login (user might already exist)
    console.log('1️⃣ Logging in...');
    let token;
    try {
      const loginResponse = await axios.post(`${API_BASE}/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      token = loginResponse.data.token;
      console.log('✅ Login successful');
    } catch (error) {
      // If login fails, register first
      console.log('❌ Login failed, registering...');
      await axios.post(`${API_BASE}/register`, {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      
      const loginResponse = await axios.post(`${API_BASE}/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      token = loginResponse.data.token;
      console.log('✅ Registered and logged in');
    }

    // 2. CREATE Post
    console.log('\n2️⃣ Creating post...');
    const createResponse = await axios.post(`${API_BASE}/posts`, {
      title: 'Test Post ' + Date.now(),
      content: 'This is test content with sufficient length for validation.',
      tags: ['test', 'api']
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const postId = createResponse.data.post._id;
    console.log('✅ Post created:', createResponse.data.post.title);

    // 3. GET All Posts
    console.log('\n3️⃣ Getting all posts...');
    const getAllResponse = await axios.get(`${API_BASE}/posts`);
    console.log('✅ Found', getAllResponse.data.posts.length, 'posts');

    // 4. GET Single Post
    console.log('\n4️⃣ Getting single post...');
    const getSingleResponse = await axios.get(`${API_BASE}/posts/${postId}`);
    console.log('✅ Post title:', getSingleResponse.data.title);

    // 5. UPDATE Post
    console.log('\n5️⃣ Updating post...');
    const updateResponse = await axios.put(`${API_BASE}/posts/${postId}`, {
      title: 'Updated Post ' + Date.now(),
      content: 'This is the updated content with sufficient length.',
      tags: ['updated', 'test']
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Post updated:', updateResponse.data.post.title);

    // 6. DELETE Post
    console.log('\n6️⃣ Deleting post...');
    await axios.delete(`${API_BASE}/posts/${postId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('✅ Post deleted');

    console.log('\n🎉 All CRUD operations successful!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCRUD();
