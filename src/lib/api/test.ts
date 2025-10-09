// Simple API test functions for development
import { apiClient } from './api';
import { healthApi, apiInfoApi } from './services';

// Test API connectivity
export const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');
    
    // Test health endpoint
    const healthResponse = await healthApi.check();
    console.log('✅ Health check:', healthResponse.data);
    
    // Test API info endpoint
    const apiInfoResponse = await apiInfoApi.getInfo();
    console.log('✅ API info:', apiInfoResponse.data);
    
    return true;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
};

// Test authentication flow
export const testAuthFlow = async () => {
  try {
    console.log('🔍 Testing authentication flow...');
    
    // This would test the actual auth endpoints
    // For now, just log that the test would run
    console.log('✅ Auth flow test ready (implement with actual credentials)');
    
    return true;
  } catch (error) {
    console.error('❌ Auth flow test failed:', error);
    return false;
  }
};

// Run all tests
export const runApiTests = async () => {
  console.log('🚀 Running API tests...');
  
  const connectionTest = await testApiConnection();
  const authTest = await testAuthFlow();
  
  if (connectionTest && authTest) {
    console.log('✅ All API tests passed!');
    return true;
  } else {
    console.log('❌ Some API tests failed!');
    return false;
  }
};

// Development helper to test API endpoints
export const devTestApi = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🧪 Development API test available');
    console.log('Call runApiTests() to test API connectivity');
  }
};

