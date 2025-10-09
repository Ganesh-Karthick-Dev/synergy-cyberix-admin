import apiClient from './api';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User Management Types
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

// Security Tools Types
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

// Service Plans Types
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

// Ads Types
export interface Ad {
  id: string;
  title: string;
  content: string;
  link: string;
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  clicks: number;
  impressions: number;
}

export interface AdStats {
  totalAds: number;
  activeAds: number;
  totalClicks: number;
  totalImpressions: number;
  clickThroughRate: number;
  topPerformingAd: string;
}

// Notifications Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  targetAudience: 'all' | 'premium' | 'trial' | 'specific';
  sentAt?: string;
  status: 'sent' | 'scheduled' | 'failed';
  deliveryStats?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
  createdAt: string;
  createdBy: string;
}

export interface NotificationStats {
  totalNotifications: number;
  sentToday: number;
  scheduled: number;
  totalRecipients: number;
  averageOpenRate: number;
  averageClickRate: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subscriptionType: 'FREE' | 'PREMIUM' | 'ENTERPRISE';
}

export interface AuthUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  subscriptionType: string;
  status?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

// Dashboard Types
export interface DashboardStats {
  totalUsers: number;
  activeScans: number;
  totalRevenue: number;
  securityAlerts: number;
  systemHealth: number;
  uptime: string;
}

export interface Activity {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'success' | 'error';
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[];
}

// API Service Functions

// 1. USER MANAGEMENT APIs
export const userApi = {
  // Get all users with pagination and filters
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => apiClient.get<ApiResponse<PaginatedResponse<User>>>('/api/users', { params }),

  // Get user by ID
  getUserById: (id: number) => apiClient.get<ApiResponse<User>>(`/api/users/${id}`),

  // Update user
  updateUser: (id: number, data: Partial<User>) => 
    apiClient.put<ApiResponse<User>>(`/api/users/${id}`, data),

  // Update user status
  updateUserStatus: (id: number, status: string) => 
    apiClient.put<ApiResponse<{ id: number; status: string }>>(`/api/users/${id}/status`, { status }),

  // Delete user
  deleteUser: (id: number) => 
    apiClient.delete<ApiResponse<{ message: string }>>(`/api/users/${id}`),

  // Get user statistics
  getUserStats: () => apiClient.get<ApiResponse<UserStats>>('/api/users/stats/overview'),
};

// 2. SECURITY TOOLS APIs
export const securityToolsApi = {
  // Get all security tools
  getTools: (params?: {
    category?: string;
    search?: string;
    status?: string;
  }) => apiClient.get<ApiResponse<SecurityTool[]>>('/api/security-tools', { params }),

  // Get tool categories
  getCategories: () => apiClient.get<ApiResponse<ToolCategory[]>>('/api/security-tools/categories'),

  // Toggle tool status
  toggleTool: (id: string) => 
    apiClient.put<ApiResponse<{ message: string }>>(`/api/security-tools/${id}/toggle`),

  // Deploy updates
  deployUpdates: () => 
    apiClient.post<ApiResponse<{ message: string }>>('/api/security-tools/deploy-updates'),
};

// 3. SERVICE PLANS APIs
export const plansApi = {
  // Get all plans
  getPlans: (params?: {
    search?: string;
    status?: string;
    isPopular?: boolean;
  }) => apiClient.get<ApiResponse<ServicePlan[]>>('/api/plans', { params }),

  // Get plan by ID
  getPlanById: (id: string) => apiClient.get<ApiResponse<ServicePlan>>(`/api/plans/${id}`),

  // Create plan
  createPlan: (data: Omit<ServicePlan, 'id' | 'createdAt' | 'updatedAt'>) => 
    apiClient.post<ApiResponse<ServicePlan>>('/api/plans', data),

  // Update plan
  updatePlan: (id: string, data: Partial<ServicePlan>) => 
    apiClient.put<ApiResponse<ServicePlan>>(`/api/plans/${id}`, data),

  // Delete plan
  deletePlan: (id: string) => 
    apiClient.delete<ApiResponse<{ message: string }>>(`/api/plans/${id}`),
};

// 4. POST ADS APIs
export const adsApi = {
  // Get all ads
  getAds: (params?: {
    search?: string;
    status?: string;
    priority?: string;
  }) => apiClient.get<ApiResponse<Ad[]>>('/api/ads', { params }),

  // Get ad statistics
  getAdStats: () => apiClient.get<ApiResponse<AdStats>>('/api/ads/stats'),

  // Create ad
  createAd: (data: Omit<Ad, 'id' | 'createdAt' | 'updatedAt' | 'clicks' | 'impressions'>) => 
    apiClient.post<ApiResponse<Ad>>('/api/ads', data),

  // Update ad
  updateAd: (id: string, data: Partial<Ad>) => 
    apiClient.put<ApiResponse<Ad>>(`/api/ads/${id}`, data),

  // Toggle ad status
  toggleAd: (id: string) => 
    apiClient.put<ApiResponse<{ message: string }>>(`/api/ads/${id}/toggle`),

  // Delete ad
  deleteAd: (id: string) => 
    apiClient.delete<ApiResponse<{ message: string }>>(`/api/ads/${id}`),
};

// 5. PUSH NOTIFICATIONS APIs
export const notificationsApi = {
  // Get all notifications
  getNotifications: (params?: {
    search?: string;
    status?: string;
    type?: string;
    targetAudience?: string;
  }) => apiClient.get<ApiResponse<Notification[]>>('/api/notifications', { params }),

  // Get notification statistics
  getNotificationStats: () => apiClient.get<ApiResponse<NotificationStats>>('/api/notifications/stats'),

  // Create notification
  createNotification: (data: Omit<Notification, 'id' | 'createdAt' | 'createdBy' | 'deliveryStats'>) => 
    apiClient.post<ApiResponse<Notification>>('/api/notifications', data),

  // Send notification
  sendNotification: (id: string) => 
    apiClient.post<ApiResponse<{ message: string }>>(`/api/notifications/${id}/send`),

  // Delete notification
  deleteNotification: (id: string) => 
    apiClient.delete<ApiResponse<{ message: string }>>(`/api/notifications/${id}`),
};

// 6. AUTHENTICATION APIs
export const authApi = {
  // User registration
  register: (data: RegisterRequest) => 
    apiClient.post<ApiResponse<{ user: AuthUser; message: string }>>('/api/register', data),

  // User login
  login: (data: LoginRequest) => 
    apiClient.post<ApiResponse<AuthResponse>>('/api/auth/login', data),

  // User logout
  logout: () => apiClient.post<ApiResponse<{ message: string }>>('/api/auth/logout'),

  // Get user profile
  getProfile: () => apiClient.get<ApiResponse<AuthUser>>('/api/auth/profile'),

  // Refresh token
  refreshToken: (refreshToken: string) => 
    apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/api/auth/refresh', { refreshToken }),
};

// 7. DASHBOARD APIs
export const dashboardApi = {
  // Get dashboard statistics
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>('/api/dashboard/stats'),

  // Get recent activity
  getActivity: () => apiClient.get<ApiResponse<Activity[]>>('/api/dashboard/activity'),

  // Get revenue chart data
  getRevenueChart: () => apiClient.get<ApiResponse<ChartData>>('/api/dashboard/revenue-chart'),

  // Get users chart data
  getUsersChart: () => apiClient.get<ApiResponse<ChartData>>('/api/dashboard/users-chart'),
};

// 8. ADMIN APIs
export const adminApi = {
  // Get all users (admin)
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => apiClient.get<ApiResponse<PaginatedResponse<User>>>('/api/admin/users', { params }),

  // Get user by ID (admin)
  getUserById: (id: number) => apiClient.get<ApiResponse<User>>(`/api/admin/users/${id}`),

  // Update user status (admin)
  updateUserStatus: (id: number, status: string) => 
    apiClient.put<ApiResponse<{ id: number; status: string }>>(`/api/admin/users/${id}/status`, { status }),

  // Get admin dashboard statistics
  getDashboardStats: () => apiClient.get<ApiResponse<DashboardStats>>('/api/admin/dashboard-stats'),
};

// 9. HEALTH CHECK
export const healthApi = {
  // Health check
  check: () => apiClient.get<{ status: string; timestamp: string; uptime: number; environment: string }>('/health'),
};

// 10. API INFO
export const apiInfoApi = {
  // Get API information
  getInfo: () => apiClient.get<ApiResponse<{
    name: string;
    version: string;
    description: string;
    endpoints: Record<string, string>;
  }>>('/api'),
};

