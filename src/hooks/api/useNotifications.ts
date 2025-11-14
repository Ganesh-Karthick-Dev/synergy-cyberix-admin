import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi, Notification, NotificationStats } from '@/lib/api/services';

// Query Keys
export const notificationsKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationsKeys.all, 'list'] as const,
  list: (params?: any) => [...notificationsKeys.lists(), params] as const,
  stats: () => [...notificationsKeys.all, 'stats'] as const,
};

// Get all notifications
export const useNotifications = (params?: {
  search?: string;
  status?: string;
  type?: string;
  targetAudience?: string;
}) => {
  return useQuery({
    queryKey: notificationsKeys.list(params),
    queryFn: () => notificationsApi.getNotifications(params),
    select: (response) => {
      // AxiosResponse structure: response.data = ApiResponse, response.data.data = Notification[]
      // Ensure we always return an array
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return [];
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0, // Always consider data stale to ensure fresh fetches
  });
};

// Get notification statistics
export const useNotificationStats = () => {
  return useQuery({
    queryKey: notificationsKeys.stats(),
    queryFn: () => notificationsApi.getNotificationStats(),
    select: (response) => {
      // AxiosResponse structure: response.data = ApiResponse, response.data.data = NotificationStats
      return response?.data?.data || null;
    },
  });
};

// Create notification mutation
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Notification, 'id' | 'createdAt' | 'createdBy' | 'deliveryStats'>) =>
      notificationsApi.createNotification(data),
    onSuccess: () => {
      // Invalidate all notification queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      // Also explicitly refetch
      queryClient.refetchQueries({ queryKey: notificationsKeys.all });
    },
  });
};

// Send notification mutation
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.sendNotification(id),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      queryClient.refetchQueries({ queryKey: notificationsKeys.all });
    },
  });
};

// Delete notification mutation
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      queryClient.refetchQueries({ queryKey: notificationsKeys.all });
    },
  });
};

