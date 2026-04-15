import api from "./api";

const authService = {
  login: async (credentials) => {
    return await api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },

  getCurrentUser: async () => {
    return await api.get('/users/profile/current');
  },

  refreshToken: async () => {
    return await api.post('/auth/refresh-token');
  },

  logout: async () => {
    return await api.post('/auth/logout');
  },
};

export default authService;
