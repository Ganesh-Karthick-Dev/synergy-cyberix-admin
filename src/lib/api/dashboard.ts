import apiClient from '../api';

// Types for Dashboard API
export interface LoginDetails {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastLogin?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
}

export interface UpdatedProfile {
  id: string;
  name: string;
  email: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

/**
 * 4.1 Get User Login Details
 * GET /api/dashboard/login-details
 * Returns user profile information for dashboard display
 */
export const getLoginDetails = async (): Promise<ApiResponse<LoginDetails>> => {
  const response = await apiClient.get('/api/dashboard/login-details');
  return response.data;
};

/**
 * 4.2 Update User Profile
 * PUT /api/dashboard/update-profile
 * Updates user name and/or email dynamically
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<ApiResponse<UpdatedProfile>> => {
  const response = await apiClient.put('/api/dashboard/update-profile', data);
  return response.data;
};
