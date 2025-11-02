import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/api';
import { showToast } from '@/utils/toast';

export const useForceLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        console.log('🔄 Attempting force logout...');
        const response = await apiClient.post('/api/auth/logout-all');
        console.log('✅ Force logout response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error('❌ Force logout error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('✅ Force logout successful:', data);
      // Clear all local storage
      // Note: Backend clears httpOnly cookies automatically
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
      }
      
      // Show success message from API response or default
      const message = data?.message || 'Logged out from all devices successfully!';
      showToast.success(message);
    },
    onError: (error: any) => {
      console.error('❌ Force logout failed:', error);
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to logout from all devices';
      showToast.error(errorMessage);
    },
  });
};
