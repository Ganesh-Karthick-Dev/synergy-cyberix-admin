import apiClient from '../api';

// Types based on exact API documentation structure
export interface ServicePlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  deliveryDays: number;
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface CreatePlanRequest {
  name: string;
  price: number;
  description: string;
  features: string[];
  deliveryDays: number;
  isPopular: boolean;
  isActive: boolean;
}

export interface UpdatePlanRequest {
  name?: string;
  price?: number;
  description?: string;
  features?: string[];
  deliveryDays?: number;
  isPopular?: boolean;
  isActive?: boolean;
}

// SERVICE PLANS API FUNCTIONS - Exact implementation from documentation

/**
 * 3.1 Get All Service Plans
 * GET /api/plans
 * Query Parameters: search, status, isPopular
 */
export const getPlans = async (params?: {
  search?: string;
  status?: string;
  isPopular?: boolean;
}): Promise<ApiResponse<ServicePlan[]>> => {
  const response = await apiClient.get('/api/plans', { params });
  return response.data;
};

/**
 * 3.2 Create Service Plan
 * POST /api/plans
 */
export const createPlan = async (data: CreatePlanRequest): Promise<ApiResponse<ServicePlan>> => {
  const response = await apiClient.post('/api/plans', data);
  return response.data;
};

/**
 * 3.3 Get Plan by ID
 * GET /api/plans/:id
 */
export const getPlanById = async (id: string): Promise<ApiResponse<ServicePlan>> => {
  const response = await apiClient.get(`/api/plans/${id}`);
  return response.data;
};

/**
 * 3.4 Update Plan
 * PUT /api/plans/:id
 */
export const updatePlan = async (
  id: string,
  data: UpdatePlanRequest
): Promise<ApiResponse<ServicePlan>> => {
  const response = await apiClient.put(`/api/plans/${id}`, data);
  return response.data;
};

/**
 * 3.5 Delete Plan
 * DELETE /api/plans/:id
 */
export const deletePlan = async (id: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete(`/api/plans/${id}`);
  return response.data;
};

/**
 * 3.6 Toggle Plan Status (Active/Inactive)
 * PUT /api/plans/:id/toggle-status
 */
export const togglePlanStatus = async (id: string): Promise<ApiResponse<ServicePlan>> => {
  const response = await apiClient.put(`/api/plans/${id}/toggle-status`);
  return response.data;
};
