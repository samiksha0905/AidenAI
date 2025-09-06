import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// API methods
export const apiService = {
  // Get all services
  getServices: () => api.get('/services'),
  
  // Get single service by URL
  getService: (url) => api.get(`/services/${url}`),
  
  // Chat with the bot
  chat: (query) => api.post('/chat', { query }),
  
  // Health check
  health: () => axios.get(`${API_BASE_URL.replace('/api', '')}/health`),
};

export default api;
