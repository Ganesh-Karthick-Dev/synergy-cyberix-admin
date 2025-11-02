import { useQuery } from '@tanstack/react-query';
import { authApi, BlockStatus } from '@/lib/api/services';

// Query Keys
export const blockStatusKeys = {
  all: ['blockStatus'] as const,
  byEmail: (email: string) => [...blockStatusKeys.all, email] as const,
};

// Check block status for an email
export const useBlockStatus = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: blockStatusKeys.byEmail(email),
    queryFn: () => authApi.checkBlockStatus(email),
    enabled: enabled && !!email && email.includes('@'), // Only check if email contains @ (valid email format)
    select: (response) => response.data,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: false, // Don't auto-refetch - only check when explicitly enabled
    refetchIntervalInBackground: false,
  });
};

// Hook to check if an email is currently blocked
export const useIsEmailBlocked = (email: string, enabled: boolean = true) => {
  const { data: blockStatus, isLoading, error } = useBlockStatus(email, enabled);
  
  return {
    isBlocked: blockStatus?.isBlocked || false,
    attempts: blockStatus?.attempts || 0,
    remainingMinutes: blockStatus?.remainingMinutes || 0,
    blockedAt: blockStatus?.blockedAt,
    expiresAt: blockStatus?.expiresAt,
    isLoading,
    error,
  };
};
