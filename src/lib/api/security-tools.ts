import apiClient from '../api';

// Types based on exact API documentation structure
export interface SecurityTool {
  id: string;
  name: string;
  description: string;
  category: 'scanning' | 'monitoring' | 'analysis' | 'reporting';
  isEnabled: boolean;
  features: string[];
  status: 'active' | 'inactive';
  lastUpdated: string;
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// SECURITY TOOLS API FUNCTIONS - Exact implementation from documentation

/**
 * 2.1 Get All Security Tools
 * GET /api/security-tools
 * Query Parameters: category, search, status
 */
export const getSecurityTools = async (params?: {
  category?: string;
  search?: string;
  status?: string;
}): Promise<ApiResponse<SecurityTool[]>> => {
  const response = await apiClient.get('/api/security-tools', { params });
  return response.data;
};

/**
 * 2.2 Get Tool Categories
 * GET /api/security-tools/categories
 */
export const getToolCategories = async (): Promise<ApiResponse<ToolCategory[]>> => {
  const response = await apiClient.get('/api/security-tools/categories');
  return response.data;
};

/**
 * 2.3 Toggle Tool Status
 * PUT /api/security-tools/:id/toggle
 */
export const toggleToolStatus = async (id: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.put(`/api/security-tools/${id}/toggle`);
  return response.data;
};

/**
 * 2.4 Deploy Updates
 * POST /api/security-tools/deploy-updates
 */
export const deployUpdates = async (): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.post('/api/security-tools/deploy-updates');
  return response.data;
};
