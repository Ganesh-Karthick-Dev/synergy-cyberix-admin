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
    select: (response) => response.data,
  });
};

// Get notification statistics
export const useNotificationStats = () => {
  return useQuery({
    queryKey: notificationsKeys.stats(),
    queryFn: () => notificationsApi.getNotificationStats(),
    select: (response) => response.data,
  });
};

// Create notification mutation
export const useCreateNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Notification, 'id' | 'createdAt' | 'createdBy' | 'deliveryStats'>) =>
      notificationsApi.createNotification(data),
    onSuccess: () => {
      // Invalidate and refetch notifications list
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: notificationsKeys.stats() });
    },
  });
};

// Send notification mutation
export const useSendNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.sendNotification(id),
    onSuccess: () => {
      // Invalidate and refetch notifications list
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: notificationsKeys.stats() });
    },
  });
};

// Delete notification mutation
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      // Invalidate and refetch notifications list
      queryClient.invalidateQueries({ queryKey: notificationsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: notificationsKeys.stats() });
    },
  });
};

