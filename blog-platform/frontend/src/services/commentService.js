import api from './api';

const commentService = {
  getCommentsByPost: async (postId, params = {}) => {
    return await api.get(`/comments/post/${postId}`, { params });
  },

  addComment: async (postId, commentData) => {
    return await api.post(`/comments/post/${postId}`, commentData);
  },

  updateComment: async (commentId, commentData) => {
    return await api.put(`/comments/${commentId}`, commentData);
  },

  deleteComment: async (commentId) => {
    return await api.delete(`/comments/${commentId}`);
  },
};

export default commentService;
