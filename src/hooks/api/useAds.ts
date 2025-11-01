import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getAds, 
  getAdStats, 
  createAd, 
  updateAd, 
  toggleAdStatus, 
  deleteAd 
} from '@/lib/api/post-ads';
import { Ad, AdStats } from '@/lib/api/services';

// Query Keys
export const adsKeys = {
  all: ['ads'] as const,
  lists: () => [...adsKeys.all, 'list'] as const,
  list: (params?: any) => [...adsKeys.lists(), params] as const,
  stats: () => [...adsKeys.all, 'stats'] as const,
};

// Get all ads
export const useAds = (params?: {
  search?: string;
  status?: string;
  priority?: string;
}) => {
  return useQuery({
    queryKey: adsKeys.list(params),
    queryFn: () => getAds(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get ad statistics
export const useAdStats = () => {
  return useQuery({
    queryKey: adsKeys.stats(),
    queryFn: () => getAdStats(),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000,
  });
};

// Create ad mutation
export const useCreateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      link?: string;
      priority: 'high' | 'medium' | 'low';
      startDate: string;
      endDate: string;
      isActive?: boolean;
    }) => createAd(data),
    onSuccess: () => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to create ad:', error);
    },
  });
};

// Update ad mutation
export const useUpdateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { 
      id: string; 
      data: Partial<{
        title: string;
        content: string;
        link: string;
        priority: 'high' | 'medium' | 'low';
        startDate: string;
        endDate: string;
        isActive: boolean;
      }> 
    }) => updateAd(id, data),
    onSuccess: () => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to update ad:', error);
    },
  });
};

// Toggle ad status mutation
export const useToggleAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleAdStatus(id),
    onSuccess: () => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to toggle ad:', error);
    },
  });
};

// Delete ad mutation
export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAd(id),
    onSuccess: (_, id) => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
    onError: (error) => {
      console.error('Failed to delete ad:', error);
    },
  });
};

