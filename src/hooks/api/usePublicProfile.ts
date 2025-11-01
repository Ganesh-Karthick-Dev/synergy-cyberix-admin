import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/services';

export const publicProfileKeys = {
  all: ['publicProfile'] as const,
  byEmail: (email: string) => [...publicProfileKeys.all, email] as const,
};

// Hook to get public profile data (no authentication required)
export const usePublicProfile = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: publicProfileKeys.byEmail(email),
    queryFn: () => authApi.getPublicProfile(email),
    enabled: enabled && !!email,
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

// Hook to get authenticated profile (requires login)
export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => authApi.getProfile(),
    select: (response) => response.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  });
};


