import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { plansApi, ServicePlan } from '@/lib/api/services';

// Query Keys
export const plansKeys = {
  all: ['plans'] as const,
  lists: () => [...plansKeys.all, 'list'] as const,
  list: (params?: any) => [...plansKeys.lists(), params] as const,
  details: () => [...plansKeys.all, 'detail'] as const,
  detail: (id: string) => [...plansKeys.details(), id] as const,
};

// Get all plans
export const usePlans = (params?: {
  search?: string;
  status?: string;
  isPopular?: boolean;
}) => {
  return useQuery({
    queryKey: plansKeys.list(params),
    queryFn: () => plansApi.getPlans(params),
    select: (response) => response.data,
  });
};

// Get plan by ID
export const usePlan = (id: string) => {
  return useQuery({
    queryKey: plansKeys.detail(id),
    queryFn: () => plansApi.getPlanById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

// Create plan mutation
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<ServicePlan, 'id' | 'createdAt' | 'updatedAt'>) =>
      plansApi.createPlan(data),
    onSuccess: () => {
      // Invalidate and refetch plans list
      queryClient.invalidateQueries({ queryKey: plansKeys.lists() });
    },
  });
};

// Update plan mutation
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServicePlan> }) =>
      plansApi.updatePlan(id, data),
    onSuccess: (response, { id }) => {
      // Update the plan in cache
      queryClient.setQueryData(plansKeys.detail(id), response.data);
      // Invalidate and refetch plans list
      queryClient.invalidateQueries({ queryKey: plansKeys.lists() });
    },
  });
};

// Delete plan mutation
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plansApi.deletePlan(id),
    onSuccess: (_, id) => {
      // Remove plan from cache
      queryClient.removeQueries({ queryKey: plansKeys.detail(id) });
      // Invalidate and refetch plans list
      queryClient.invalidateQueries({ queryKey: plansKeys.lists() });
    },
  });
};

