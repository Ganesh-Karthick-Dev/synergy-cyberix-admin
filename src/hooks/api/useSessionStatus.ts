import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api/services';

export const useSessionStatus = () => {
  return useQuery({
    queryKey: ['session-status'],
    queryFn: () => authApi.getSessionStatus(),
    refetchInterval: 30000, // Check every 30 seconds
    retry: false,
    staleTime: 10000, // Consider data stale after 10 seconds
  });
};

export const useCheckSessionStatus = () => {
  return useQuery({
    queryKey: ['check-session'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/session-status', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          return { isActive: false, data: null };
        }
        
        const data = await response.json();
        return { 
          isActive: data.success && data.data.activeSessions > 0, 
          data: data.data 
        };
      } catch (error) {
        return { isActive: false, data: null };
      }
    },
    retry: false,
    staleTime: 5000,
  });
};

