import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ENV_CONFIG } from './env-config';

// API Configuration
const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

// Debug API configuration
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Environment API URL:', process.env.NEXT_PUBLIC_API_URL);

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Enable cookies for cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // For logout endpoints, don't use Authorization header - rely on cookies
    const isLogoutEndpoint = config.url?.includes('/logout');
    
    if (!isLogoutEndpoint) {
      // Get token from localStorage (for Authorization header)
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Ensure cookies are sent with requests
    config.withCredentials = true;
    
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
        withCredentials: config.withCredentials,
        isLogoutEndpoint,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken,
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Update tokens in localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);
          }
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/signin';
        }
      }
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.error?.message || error.message || 'An error occurred';
    const statusCode = error.response?.status || 500;
    
    // Log error for debugging
    console.error('API Error:', {
      message: errorMessage,
      status: statusCode,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method
    });
    
    return Promise.reject({
      message: errorMessage,
      status: statusCode,
      data: error.response?.data,
      response: error.response,
      config: error.config
    });
  }
);

export default apiClient;
