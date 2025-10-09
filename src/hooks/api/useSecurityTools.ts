import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSecurityTools,
  getToolCategories,
  toggleToolStatus,
  deployUpdates,
  SecurityTool,
  ToolCategory,
} from '@/lib/api/security-tools';

// Query Keys for Security Tools
export const securityToolsKeys = {
  all: ['security-tools'] as const,
  tools: () => [...securityToolsKeys.all, 'tools'] as const,
  toolsList: (params?: any) => [...securityToolsKeys.tools(), 'list', params] as const,
  categories: () => [...securityToolsKeys.all, 'categories'] as const,
};

/**
 * 2.1 Get All Security Tools Hook
 * GET /api/security-tools
 * Supports category, search, and status filtering
 */
export const useSecurityTools = (params?: {
  category?: string;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: securityToolsKeys.toolsList(params),
    queryFn: () => getSecurityTools(params),
    select: (response) => response.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * 2.2 Get Tool Categories Hook
 * GET /api/security-tools/categories
 */
export const useToolCategories = () => {
  return useQuery({
    queryKey: securityToolsKeys.categories(),
    queryFn: () => getToolCategories(),
    select: (response) => response.data,
    staleTime: 10 * 60 * 1000, // 10 minutes for categories
  });
};

/**
 * 2.3 Toggle Tool Status Mutation
 * PUT /api/security-tools/:id/toggle
 */
export const useToggleToolStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleToolStatus(id),
    onSuccess: () => {
      // Invalidate and refetch tools list
      queryClient.invalidateQueries({ queryKey: securityToolsKeys.tools() });
    },
    onError: (error) => {
      console.error('Failed to toggle tool status:', error);
    },
  });
};

/**
 * 2.4 Deploy Updates Mutation
 * POST /api/security-tools/deploy-updates
 */
export const useDeployUpdates = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deployUpdates(),
    onSuccess: () => {
      // Invalidate and refetch tools list
      queryClient.invalidateQueries({ queryKey: securityToolsKeys.tools() });
    },
    onError: (error) => {
      console.error('Failed to deploy updates:', error);
    },
  });
};

// Utility hooks for common operations

/**
 * Hook to get tools with search functionality
 */
export const useSecurityToolsWithSearch = (searchTerm: string, category?: string) => {
  return useSecurityTools({
    search: searchTerm || undefined,
    category: category || undefined,
  });
};

/**
 * Hook to get tools by category
 */
export const useSecurityToolsByCategory = (category: string) => {
  return useSecurityTools({ category });
};

/**
 * Hook to get active tools only
 */
export const useActiveSecurityTools = () => {
  return useSecurityTools({ status: 'active' });
};

/**
 * Hook to get inactive tools only
 */
export const useInactiveSecurityTools = () => {
  return useSecurityTools({ status: 'inactive' });
};

/**
 * Hook to get scanning tools
 */
export const useScanningTools = () => {
  return useSecurityToolsByCategory('scanning');
};

/**
 * Hook to get monitoring tools
 */
export const useMonitoringTools = () => {
  return useSecurityToolsByCategory('monitoring');
};

/**
 * Hook to get analysis tools
 */
export const useAnalysisTools = () => {
  return useSecurityToolsByCategory('analysis');
};

/**
 * Hook to get reporting tools
 */
export const useReportingTools = () => {
  return useSecurityToolsByCategory('reporting');
};