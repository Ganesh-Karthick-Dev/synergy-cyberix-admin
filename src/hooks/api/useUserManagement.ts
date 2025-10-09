import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUserStats,
  User,
  UserStats,
  UpdateUserRequest,
  UpdateUserStatusRequest,
} from '@/lib/api/user-management';

// Query Keys for User Management
export const userManagementKeys = {
  all: ['user-management'] as const,
  users: () => [...userManagementKeys.all, 'users'] as const,
  usersList: (params?: any) => [...userManagementKeys.users(), 'list', params] as const,
  userDetail: (id: number) => [...userManagementKeys.users(), 'detail', id] as const,
  userStats: () => [...userManagementKeys.all, 'stats'] as const,
};

/**
 * 1.1 Get All Users Hook
 * GET /api/users
 * Supports pagination, search, and status filtering
 */
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: userManagementKeys.usersList(params),
    queryFn: () => getUsers(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 1.2 Get User by ID Hook
 * GET /api/users/:id
 */
export const useUser = (id: number) => {
  return useQuery({
    queryKey: userManagementKeys.userDetail(id),
    queryFn: () => getUserById(id),
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 1.6 Get User Statistics Hook
 * GET /api/users/stats/overview
 */
export const useUserStats = () => {
  return useQuery({
    queryKey: userManagementKeys.userStats(),
    queryFn: () => getUserStats(),
    select: (response) => response.data,
    staleTime: 2 * 60 * 1000, // 2 minutes for stats
  });
};

/**
 * 1.3 Update User Mutation
 * PUT /api/users/:id
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      updateUser(id, data),
    onSuccess: (response, { id }) => {
      // Update the user in cache
      queryClient.setQueryData(userManagementKeys.userDetail(id), response.data);
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userManagementKeys.users() });
    },
    onError: (error) => {
      console.error('Failed to update user:', error);
    },
  });
};

/**
 * 1.4 Update User Status Mutation
 * PUT /api/users/:id/status
 */
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateUserStatus(id, { status }),
    onSuccess: (response, { id }) => {
      // Update the user in cache
      queryClient.setQueryData(userManagementKeys.userDetail(id), (old: any) => ({
        ...old,
        status: response.data.status,
      }));
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userManagementKeys.users() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: userManagementKeys.userStats() });
    },
    onError: (error) => {
      console.error('Failed to update user status:', error);
    },
  });
};

/**
 * 1.5 Delete User Mutation
 * DELETE /api/users/:id
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_, id) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userManagementKeys.userDetail(id) });
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userManagementKeys.users() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: userManagementKeys.userStats() });
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
};

// Utility hooks for common operations

/**
 * Hook to get users with search functionality
 */
export const useUsersWithSearch = (searchTerm: string, status?: string) => {
  return useUsers({
    search: searchTerm || undefined,
    status: status || undefined,
    page: 1,
    limit: 10,
  });
};

/**
 * Hook to get users by status
 */
export const useUsersByStatus = (status: string) => {
  return useUsers({
    status,
    page: 1,
    limit: 50,
  });
};

/**
 * Hook to get active users only
 */
export const useActiveUsers = () => {
  return useUsersByStatus('Active');
};

/**
 * Hook to get trial users only
 */
export const useTrialUsers = () => {
  return useUsersByStatus('Trial');
};

/**
 * Hook to get inactive users only
 */
export const useInactiveUsers = () => {
  return useUsersByStatus('Inactive');
};