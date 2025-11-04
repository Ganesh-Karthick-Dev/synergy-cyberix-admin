import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi, LoginRequest, RegisterRequest, AuthUser, AuthResponse } from '@/lib/api/services';
import { useApiErrorHandler } from '../useApiErrorHandler';
import { showToast } from '@/utils/toast';
import { storeFcmToken, removeAllFcmTokens, isFirebaseSupported, getFcmToken, VAPID_KEY, initializeFirebase, defaultFirebaseConfig } from '@/lib/firebase/firebase';

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
    onSuccess: async (response) => {
      // Backend handles authentication via cookies only
      // No tokens in response body, no need to store in localStorage
      // Cookies are automatically set by backend and sent with subsequent requests

      // Set user data in cache
      queryClient.setQueryData(authKeys.profile(), response.data.user);

      // Initialize Firebase and store FCM token for push notifications
      try {
        if (isFirebaseSupported() && VAPID_KEY) {
          // Initialize Firebase with config
          initializeFirebase(defaultFirebaseConfig);

          // Request notification permission and get FCM token
          const permissionGranted = await Notification.requestPermission();
          if (permissionGranted === 'granted') {
            const fcmToken = await getFcmToken(VAPID_KEY);
            if (fcmToken) {
              await storeFcmToken(fcmToken);
              console.log('FCM token stored successfully after login');
            }
          }
        }
      } catch (error) {
        console.error('Failed to setup FCM token after login:', error);
        // Don't fail login if FCM setup fails
      }
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
    onSuccess: async (data) => {
      console.log('✅ Logout successful:', data);

      // Remove FCM tokens from backend
      try {
        await removeAllFcmTokens();
        console.log('FCM tokens removed successfully during logout');
      } catch (error) {
        console.error('Failed to remove FCM tokens during logout:', error);
        // Don't fail logout if FCM cleanup fails
      }

      // Backend clears httpOnly cookies automatically on logout
      // The browser will automatically handle cookie clearing when the backend responds

      // Clear all cached data
      queryClient.clear();

      // Show success message
      if (data?.message) {
        showToast.success(data.message);
      }
    },
    onError: async (error: any) => {
      console.error('❌ Logout error:', error);

      // Even if logout fails on server, try to remove FCM tokens
      try {
        await removeAllFcmTokens();
      } catch (fcmError) {
        console.error('Failed to remove FCM tokens during failed logout:', fcmError);
      }

      // Clear all cached data
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

