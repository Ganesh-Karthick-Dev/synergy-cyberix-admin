import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginRequest, RegisterRequest, AuthUser, AuthResponse } from '@/lib/api/services';
import { useApiErrorHandler } from '../useApiErrorHandler';
import { showToast } from '@/utils/toast';

// Query Keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Get user profile
export const useProfile = () => {
  const { handleError } = useApiErrorHandler();

  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authApi.getProfile(),
    select: (response) => response.data,
    retry: false, // Don't retry on auth failures
    onError: (error) => {
      handleError(error);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { handleError } = useApiErrorHandler();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      
      // Store tokens in localStorage (for Authorization header)
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Note: Cookies are automatically handled by the browser when withCredentials: true
      // Your backend should set httpOnly cookies for authentication
      
      // Set user data in cache
      queryClient.setQueryData(authKeys.profile(), response.data.user);
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

// Register mutation
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: (data) => {
      console.log('✅ Logout successful:', data);
      
      // Clear tokens from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
      
      // Note: Your backend should clear httpOnly cookies on logout
      // The browser will automatically handle cookie clearing when the backend responds
      
      // Clear all cached data
      queryClient.clear();
      
      // Show success message
      if (data?.message) {
        showToast.success(data.message);
      }
    },
    onError: (error: any) => {
      console.error('❌ Logout error:', error);
      
      // Even if logout fails on server, clear local data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
      queryClient.clear();
      
      // Show error message
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Logout failed';
      showToast.error(errorMessage);
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refreshToken(refreshToken),
    onSuccess: (response) => {
      const { accessToken, refreshToken } = response.data;
      
      // Update tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
      }
    },
  });
};

