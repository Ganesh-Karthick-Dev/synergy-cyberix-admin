import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getLoginDetails,
  updateProfile,
  LoginDetails,
  UpdateProfileRequest,
  UpdatedProfile,
} from '@/lib/api/dashboard';

// Query Keys for Dashboard
export const dashboardKeys = {
  all: ['dashboard'] as const,
  loginDetails: () => [...dashboardKeys.all, 'login-details'] as const,
};

/**
 * 4.1 Get User Login Details Hook
 * GET /api/dashboard/login-details
 */
export const useLoginDetails = () => {
  return useQuery({
    queryKey: dashboardKeys.loginDetails(),
    queryFn: () => getLoginDetails(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 4.2 Update User Profile Mutation
 * PUT /api/dashboard/update-profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => updateProfile(data),
    onSuccess: (response) => {
      // Update the login details in cache
      queryClient.setQueryData(dashboardKeys.loginDetails(), response.data);
      // Invalidate and refetch login details
      queryClient.invalidateQueries({ queryKey: dashboardKeys.loginDetails() });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });
};