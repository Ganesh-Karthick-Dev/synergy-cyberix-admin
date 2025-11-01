import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/services';
import { showToast } from '@/utils/toast';

export const useLoginLogs = (params?: {
  page?: number;
  limit?: number;
  userId?: string;
}) => {
  return useQuery({
    queryKey: ['login-logs', params],
    queryFn: () => authApi.getLoginLogs(params),
    staleTime: 30000, // 30 seconds
  });
};

export const useClearLoginLogs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.clearLoginLogs(),
    onSuccess: (data) => {
      showToast.success(data.message || 'Login logs cleared successfully');
      // Invalidate and refetch login logs
      queryClient.invalidateQueries({ queryKey: ['login-logs'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to clear login logs';
      showToast.error(errorMessage);
    },
  });
};

export const useForceLogoutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason?: string }) => 
      authApi.forceLogoutUser(userId, reason),
    onSuccess: (data) => {
      showToast.success(data.message || 'User has been force logged out successfully');
      // Invalidate session status and login logs
      queryClient.invalidateQueries({ queryKey: ['session-status'] });
      queryClient.invalidateQueries({ queryKey: ['login-logs'] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to force logout user';
      showToast.error(errorMessage);
    },
  });
};