import axios from 'axios';

// Create generic Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from local storage or state management
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if client-side
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
