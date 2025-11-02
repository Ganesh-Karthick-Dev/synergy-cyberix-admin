// Utility functions for handling login
import { showToast } from './toast';

export interface LoginResponse {
  success: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
    user: any;
  };
  error?: {
    message: string;
    statusCode: number;
    code: string;
  };
}

export const handleLogin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Get device information
    const deviceInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString(),
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify({ 
        email, 
        password, 
        deviceInfo: JSON.stringify(deviceInfo) 
      })
    });

    const data = await response.json();

    if (data.success) {
      // Normal login success - cookies are automatically set by the server
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(data.data.user));
      
      showToast.success(data.message || 'Login successful! Welcome to the security scanning dashboard.');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Other login errors
      showToast.error(data.error?.message || 'Login failed. Please check your credentials.');
    }

    return data;
  } catch (error: any) {
    console.error('Login Error:', error);
    showToast.error('Login failed. Please try again.');
    throw error;
  }
};
