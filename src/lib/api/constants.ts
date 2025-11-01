// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/register',
  LOGOUT: '/api/auth/logout',
  LOGOUT_ALL: '/api/auth/logout-all',
  PROFILE: '/api/auth/profile',
  REFRESH: '/api/auth/refresh',
  
  // Users
  USERS: '/api/users',
  USER_STATS: '/api/users/stats/overview',
  
  // Security Tools
  SECURITY_TOOLS: '/api/security-tools',
  TOOL_CATEGORIES: '/api/security-tools/categories',
  DEPLOY_UPDATES: '/api/security-tools/deploy-updates',
  
  // Plans
  PLANS: '/api/plans',
  
  // Ads
  ADS: '/api/ads',
  AD_STATS: '/api/ads/stats',
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  NOTIFICATION_STATS: '/api/notifications/stats',
  
  // Dashboard
  DASHBOARD_STATS: '/api/dashboard/stats',
  DASHBOARD_ACTIVITY: '/api/dashboard/activity',
  REVENUE_CHART: '/api/dashboard/revenue-chart',
  USERS_CHART: '/api/dashboard/users-chart',
  
  // Admin
  ADMIN_USERS: '/api/admin/users',
  ADMIN_DASHBOARD_STATS: '/api/admin/dashboard-stats',
  
  // Health & Info
  HEALTH: '/health',
  API_INFO: '/api',
} as const;

// Query Keys
export const QUERY_KEYS = {
  // Users
  USERS: ['users'] as const,
  USER_DETAIL: (id: number) => ['users', 'detail', id] as const,
  USER_STATS: ['users', 'stats'] as const,
  
  // Security Tools
  SECURITY_TOOLS: ['security-tools'] as const,
  TOOL_CATEGORIES: ['security-tools', 'categories'] as const,
  
  // Plans
  PLANS: ['plans'] as const,
  PLAN_DETAIL: (id: string) => ['plans', 'detail', id] as const,
  
  // Ads
  ADS: ['ads'] as const,
  AD_STATS: ['ads', 'stats'] as const,
  
  // Notifications
  NOTIFICATIONS: ['notifications'] as const,
  NOTIFICATION_STATS: ['notifications', 'stats'] as const,
  
  // Dashboard
  DASHBOARD_STATS: ['dashboard', 'stats'] as const,
  DASHBOARD_ACTIVITY: ['dashboard', 'activity'] as const,
  REVENUE_CHART: ['dashboard', 'revenue-chart'] as const,
  USERS_CHART: ['dashboard', 'users-chart'] as const,
  
  // Auth
  AUTH_PROFILE: ['auth', 'profile'] as const,
  
  // Admin
  ADMIN_USERS: ['admin', 'users'] as const,
  ADMIN_USER_DETAIL: (id: number) => ['admin', 'users', 'detail', id] as const,
  ADMIN_DASHBOARD_STATS: ['admin', 'dashboard-stats'] as const,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access forbidden.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNKNOWN: 'An unknown error occurred.',
} as const;

