// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const;

// Environment check
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// API endpoints configuration
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    LIST: '/api/users',
    DETAIL: (id: number) => `/api/users/${id}`,
    STATS: '/api/users/stats/overview',
    UPDATE_STATUS: (id: number) => `/api/users/${id}/status`,
  },
  SECURITY_TOOLS: {
    LIST: '/api/security-tools',
    CATEGORIES: '/api/security-tools/categories',
    TOGGLE: (id: string) => `/api/security-tools/${id}/toggle`,
    DEPLOY_UPDATES: '/api/security-tools/deploy-updates',
  },
  PLANS: {
    LIST: '/api/plans',
    DETAIL: (id: string) => `/api/plans/${id}`,
  },
  ADS: {
    LIST: '/api/ads',
    STATS: '/api/ads/stats',
    TOGGLE: (id: string) => `/api/ads/${id}/toggle`,
  },
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    STATS: '/api/notifications/stats',
    SEND: (id: string) => `/api/notifications/${id}/send`,
  },
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    ACTIVITY: '/api/dashboard/activity',
    REVENUE_CHART: '/api/dashboard/revenue-chart',
    USERS_CHART: '/api/dashboard/users-chart',
  },
  ADMIN: {
    USERS: '/api/admin/users',
    USER_DETAIL: (id: number) => `/api/admin/users/${id}`,
    USER_STATUS: (id: number) => `/api/admin/users/${id}/status`,
    DASHBOARD_STATS: '/api/admin/dashboard-stats',
  },
  HEALTH: '/health',
  API_INFO: '/api',
} as const;