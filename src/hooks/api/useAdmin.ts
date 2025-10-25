import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, User, DashboardStats, PaginatedResponse } from '@/lib/api/services';

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (params?: any) => [...adminKeys.users(), 'list', params] as const,
  userDetail: (id: number) => [...adminKeys.users(), 'detail', id] as const,
  dashboardStats: () => [...adminKeys.all, 'dashboard-stats'] as const,
};

// Get all users (admin)
export const useAdminUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: adminKeys.userList(params),
    queryFn: () => adminApi.getUsers(params),
    select: (response) => response.data,
  });
};

// Get user by ID (admin)
export const useAdminUser = (id: number) => {
  return useQuery({
    queryKey: adminKeys.userDetail(id),
    queryFn: () => adminApi.getUserById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Update user status (admin)
export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      adminApi.updateUserStatus(id, status),
    onSuccess: (response, { id }) => {
      // Update the user in cache
      queryClient.setQueryData(adminKeys.userDetail(id), (old: any) => ({
        ...old,
        status: response.data.status,
      }));
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};

// Get admin dashboard statistics
export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: adminKeys.dashboardStats(),
    queryFn: () => adminApi.getDashboardStats(),
    select: (response) => response.data,
  });
};

