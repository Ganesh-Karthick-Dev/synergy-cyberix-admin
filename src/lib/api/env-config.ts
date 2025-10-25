// Environment Configuration for API Integration
export const ENV_CONFIG = {
  // API Base URL - Change this to your actual API server
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
  
  // Development settings
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // API Timeout settings
  API_TIMEOUT: 30000, // 30 seconds
  
  // Cache settings
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  
  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Validate API configuration
export const validateApiConfig = () => {
  const config = {
    apiUrl: ENV_CONFIG.API_BASE_URL,
    isConfigured: !!ENV_CONFIG.API_BASE_URL,
    isLocal: ENV_CONFIG.API_BASE_URL.includes('localhost'),
    isProduction: ENV_CONFIG.IS_PRODUCTION,
  };
  
  console.log('🔧 API Configuration:', config);
  
  if (!config.isConfigured) {
    console.warn('⚠️ API URL not configured. Using default localhost:9000');
  }
  
  return config;
};

// Initialize API configuration
export const initApiConfig = () => {
  const config = validateApiConfig();
  
  if (config.isLocal && config.isProduction) {
    console.warn('⚠️ Running in production mode with localhost API. This should not be used in production.');
  }
  
  return config;
};

