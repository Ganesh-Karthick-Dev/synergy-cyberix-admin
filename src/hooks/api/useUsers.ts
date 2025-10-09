import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, User, UserStats, PaginatedResponse } from '@/lib/api/services';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: any) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

// Get all users with pagination and filters
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userApi.getUsers(params),
    select: (response) => response.data,
  });
};

// Get user by ID
export const useUser = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userApi.getUserById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Get user statistics
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userApi.getUserStats(),
    select: (response) => response.data,
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      userApi.updateUser(id, data),
    onSuccess: (response, { id }) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(id), response.data);
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Update user status mutation
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      userApi.updateUserStatus(id, status),
    onSuccess: (response, { id }) => {
      // Update the user in cache
      queryClient.setQueryData(userKeys.detail(id), (old: any) => ({
        ...old,
        status: response.data.status,
      }));
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => userApi.deleteUser(id),
    onSuccess: (_, id) => {
      // Remove user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
    },
  });
};

