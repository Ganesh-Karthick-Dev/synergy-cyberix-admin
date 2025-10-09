import { useQuery } from '@tanstack/react-query';
import { dashboardApi, DashboardStats, Activity, ChartData } from '@/lib/api/services';

// Query Keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  activity: () => [...dashboardKeys.all, 'activity'] as const,
  revenueChart: () => [...dashboardKeys.all, 'revenue-chart'] as const,
  usersChart: () => [...dashboardKeys.all, 'users-chart'] as const,
};

// Get dashboard statistics
export const useDashboardStats = () => {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => dashboardApi.getStats(),
    select: (response) => response.data,
  });
};

// Get recent activity
export const useDashboardActivity = () => {
  return useQuery({
    queryKey: dashboardKeys.activity(),
    queryFn: () => dashboardApi.getActivity(),
    select: (response) => response.data,
  });
};

// Get revenue chart data
export const useRevenueChart = () => {
  return useQuery({
    queryKey: dashboardKeys.revenueChart(),
    queryFn: () => dashboardApi.getRevenueChart(),
    select: (response) => response.data,
  });
};

// Get users chart data
export const useUsersChart = () => {
  return useQuery({
    queryKey: dashboardKeys.usersChart(),
    queryFn: () => dashboardApi.getUsersChart(),
    select: (response) => response.data,
  });
};

