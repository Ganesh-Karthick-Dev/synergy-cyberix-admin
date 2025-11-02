import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { ENV_CONFIG } from './env-config';

// API Configuration
const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

// Debug API configuration
console.log('🔧 API Base URL:', API_BASE_URL);
console.log('🔧 Environment API URL:', process.env.NEXT_PUBLIC_API_URL);

// Create Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // Call backend directly
  timeout: 30000,
  withCredentials: true, // Enable cookies for cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('🔧 [API Client] Configuration:', {
  apiBaseURL: API_BASE_URL,
  note: 'Direct calls to backend with cookies',
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Backend handles authentication via cookies
    // Ensure cookies are sent with requests
    config.withCredentials = true;

    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`);

      // Log cookies that will be sent
      if (typeof document !== 'undefined') {
        const allCookies = document.cookie;
        const cookieList = allCookies.split(';').map(c => c.trim()).filter(c => c);
        console.log(`🚀 [API] Cookies: ${cookieList.length} found, has accessToken: ${allCookies.includes('accessToken')}`);
      }
    }

    return config;
  },
    (error) => {
      console.error('❌ [Frontend API] Request Interceptor Error:', error);
      
      // Check for connection errors
      if (error.code === 'ECONNREFUSED' || error.message?.includes('ERR_CONNECTION_REFUSED')) {
        console.error('❌ [Frontend API] ===== CONNECTION REFUSED =====');
        console.error('❌ [Frontend API] Backend server appears to be down or unreachable');
        console.error('❌ [Frontend API] API Base URL:', API_BASE_URL);
        console.error('❌ [Frontend API] Please ensure backend server is running on:', API_BASE_URL);
      }
      
      return Promise.reject(error);
    }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }

    return response;
  },
  async (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [API] ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status}: ${error.response?.data?.error?.message || error.message}`);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
