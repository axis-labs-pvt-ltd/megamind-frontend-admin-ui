import { useAuthStore } from '@/store/useAuthStore';
import axios from 'axios';

// Create a singleton instance
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    // Get the token from Zustand store (or direct localStorage/cookie if outside React context easier)
    // Note: Zustand stores can be used outside components!
    const token = useAuthStore.getState().token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors (401, etc)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (e.g., token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Logic to refresh token or logout user could go here
      // For now, let's just logout to be safe
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
