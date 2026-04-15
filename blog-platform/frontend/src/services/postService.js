import api from './api';

const postService = {
  getAllPosts: async (params = {}) => {
    return await api.get('/posts', { params });
  },

  getPostById: async (postId) => {
    return await api.get(`/posts/${postId}`);
  },

  createPost: async (postData) => {
    return await api.post('/posts', postData);
  },

  updatePost: async (postId, postData) => {
    return await api.put(`/posts/${postId}`, postData);
  },

  deletePost: async (postId) => {
    return await api.delete(`/posts/${postId}`);
  },

  toggleLike: async (postId) => {
    return await api.post(`/posts/${postId}/like`);
  },

  searchPosts: async (params) => {
    return await api.get('/posts/search', { params });
  },

  getUserProfile: async (userId) => {
    return await api.get(`/users/${userId}`);
  },

  getUserPosts: async (userId, params = {}) => {
    return await api.get(`/users/${userId}/posts`, { params });
  },

  updateProfile: async (profileData) => {
    return await api.put('/users/profile', profileData);
  },
};

export default postService;
