import apiClient from '../api';

// Types based on exact API documentation structure
export interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: 'Active' | 'Inactive' | 'Trial' | 'Expired';
  lastScan: string;
  scansCompleted: number;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  trialUsers: number;
  premiumUsers: number;
  newUsersToday: number;
  churnRate: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  company?: string;
  plan?: string;
  status?: string;
}

export interface UpdateUserStatusRequest {
  status: string;
}

// USER MANAGEMENT API FUNCTIONS - Exact implementation from documentation

/**
 * 1.1 Get All Users
 * GET /api/users
 * Query Parameters: page, limit, search, status
 */
export const getUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<ApiResponse<UsersResponse>> => {
  const response = await apiClient.get('/api/users', { params });
  return response.data;
};

/**
 * 1.2 Get User by ID
 * GET /api/users/:id
 */
export const getUserById = async (id: number): Promise<ApiResponse<User>> => {
  const response = await apiClient.get(`/api/users/${id}`);
  return response.data;
};

/**
 * 1.3 Update User
 * PUT /api/users/:id
 */
export const updateUser = async (
  id: number,
  data: UpdateUserRequest
): Promise<ApiResponse<User>> => {
  const response = await apiClient.put(`/api/users/${id}`, data);
  return response.data;
};

/**
 * 1.4 Update User Status
 * PUT /api/users/:id/status
 */
export const updateUserStatus = async (
  id: number,
  data: UpdateUserStatusRequest
): Promise<ApiResponse<{ id: number; status: string }>> => {
  const response = await apiClient.put(`/api/users/${id}/status`, data);
  return response.data;
};

/**
 * 1.5 Delete User
 * DELETE /api/users/:id
 */
export const deleteUser = async (id: number): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.delete(`/api/users/${id}`);
  return response.data;
};

/**
 * 1.6 Get User Statistics
 * GET /api/users/stats/overview
 */
export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  const response = await apiClient.get('/api/users/stats/overview');
  return response.data;
};