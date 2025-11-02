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
      // Backend handles authentication via cookies only
      // No tokens in response body, no need to store in localStorage
      // Cookies are automatically set by backend and sent with subsequent requests
      
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
      
      // Backend clears httpOnly cookies automatically on logout
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
      
      // Even if logout fails on server, backend should still clear cookies
      queryClient.clear();
      
      // Show error message
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Logout failed';
      showToast.error(errorMessage);
    },
  });
};

// Refresh token mutation
// Note: Backend handles token refresh automatically via cookies
// This is kept for backward compatibility but tokens are managed by backend
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => authApi.refreshToken(),
    onSuccess: () => {
      // Backend refreshes tokens and sets new cookies automatically
      // No action needed on frontend
    },
  });
};

