import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adsApi, Ad, AdStats } from '@/lib/api/services';

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
    queryFn: () => adsApi.getAds(params),
    select: (response) => response.data,
  });
};

// Get ad statistics
export const useAdStats = () => {
  return useQuery({
    queryKey: adsKeys.stats(),
    queryFn: () => adsApi.getAdStats(),
    select: (response) => response.data,
  });
};

// Create ad mutation
export const useCreateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Ad, 'id' | 'createdAt' | 'updatedAt' | 'clicks' | 'impressions'>) =>
      adsApi.createAd(data),
    onSuccess: () => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
  });
};

// Update ad mutation
export const useUpdateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Ad> }) =>
      adsApi.updateAd(id, data),
    onSuccess: () => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
  });
};

// Toggle ad status mutation
export const useToggleAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adsApi.toggleAd(id),
    onSuccess: () => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
  });
};

// Delete ad mutation
export const useDeleteAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adsApi.deleteAd(id),
    onSuccess: () => {
      // Invalidate and refetch ads list
      queryClient.invalidateQueries({ queryKey: adsKeys.lists() });
      // Invalidate stats
      queryClient.invalidateQueries({ queryKey: adsKeys.stats() });
    },
  });
};

