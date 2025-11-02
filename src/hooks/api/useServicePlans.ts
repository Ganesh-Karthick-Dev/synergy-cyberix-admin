import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPlans,
  createPlan,
  getPlanById,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  ServicePlan,
  CreatePlanRequest,
  UpdatePlanRequest,
} from '@/lib/api/service-plans';

// Query Keys for Service Plans
export const servicePlansKeys = {
  all: ['service-plans'] as const,
  plans: () => [...servicePlansKeys.all, 'plans'] as const,
  plansList: (params?: any) => [...servicePlansKeys.plans(), 'list', params] as const,
  planDetail: (id: string) => [...servicePlansKeys.plans(), 'detail', id] as const,
};

/**
 * 3.1 Get All Service Plans Hook
 * GET /api/plans
 * Supports search, status, and popularity filtering
 */
export const usePlans = (params?: {
  search?: string;
  status?: string;
  isPopular?: boolean;
}) => {
  return useQuery({
    queryKey: servicePlansKeys.plansList(params),
    queryFn: () => getPlans(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 3.3 Get Plan by ID Hook
 * GET /api/plans/:id
 */
export const usePlan = (id: string) => {
  return useQuery({
    queryKey: servicePlansKeys.planDetail(id),
    queryFn: () => getPlanById(id),
    select: (response) => response.data,
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * 3.2 Create Plan Mutation
 * POST /api/plans
 */
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanRequest) => createPlan(data),
    onSuccess: () => {
      // Invalidate and refetch plans list
      queryClient.invalidateQueries({ queryKey: servicePlansKeys.plans() });
    },
    onError: (error) => {
      console.error('Failed to create plan:', error);
    },
  });
};

/**
 * 3.4 Update Plan Mutation
 * PUT /api/plans/:id
 */
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanRequest }) =>
      updatePlan(id, data),
    onSuccess: (response, { id }) => {
      // Update the plan in cache
      queryClient.setQueryData(servicePlansKeys.planDetail(id), response.data);
      // Invalidate and refetch plans list
      queryClient.invalidateQueries({ queryKey: servicePlansKeys.plans() });
    },
    onError: (error) => {
      console.error('Failed to update plan:', error);
    },
  });
};

/**
 * 3.5 Delete Plan Mutation
 * DELETE /api/plans/:id
 */
export const useDeletePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePlan(id),
    onSuccess: (_, id) => {
      // Remove plan from cache
      queryClient.removeQueries({ queryKey: servicePlansKeys.planDetail(id) });
      // Invalidate and refetch plans list
      queryClient.invalidateQueries({ queryKey: servicePlansKeys.plans() });
    },
    onError: (error) => {
      console.error('Failed to delete plan:', error);
    },
  });
};

/**
 * 3.6 Toggle Plan Status Mutation
 * PUT /api/plans/:id/toggle-status
 */
export const useTogglePlanStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => togglePlanStatus(id),
    onSuccess: (response, id) => {
      // Update the plan in cache
      queryClient.setQueryData(servicePlansKeys.planDetail(id), response.data);
      // Invalidate and refetch plans list to update UI
      queryClient.invalidateQueries({ queryKey: servicePlansKeys.plans() });
    },
    onError: (error) => {
      console.error('Failed to toggle plan status:', error);
    },
  });
};

// Utility hooks for common operations

/**
 * Hook to get plans with search functionality
 */
export const usePlansWithSearch = (searchTerm: string, status?: string) => {
  return usePlans({
    search: searchTerm || undefined,
    status: status || undefined,
  });
};

/**
 * Hook to get active plans only
 */
export const useActivePlans = () => {
  return usePlans({ status: 'active' });
};

/**
 * Hook to get popular plans only
 */
export const usePopularPlans = () => {
  return usePlans({ isPopular: true });
};

/**
 * Hook to get inactive plans only
 */
export const useInactivePlans = () => {
  return usePlans({ status: 'inactive' });
};

