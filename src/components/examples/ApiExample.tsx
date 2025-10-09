'use client';

import React, { useState } from 'react';
import { 
  useUsers, 
  useUserStats, 
  useUpdateUserStatus, 
  useDeleteUser,
  useDashboardStats,
  useSecurityTools,
  usePlans,
  useAds,
  useNotifications
} from '@/hooks/api';

// Example component demonstrating API integration
export const ApiExample: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Users API
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers({
    search: searchTerm,
    status: selectedStatus,
    page: 1,
    limit: 10,
  });

  const { data: userStats, isLoading: statsLoading } = useUserStats();
  const updateUserStatus = useUpdateUserStatus();
  const deleteUser = useDeleteUser();

  // Dashboard API
  const { data: dashboardStats, isLoading: dashboardLoading } = useDashboardStats();

  // Security Tools API
  const { data: securityTools, isLoading: toolsLoading } = useSecurityTools();

  // Plans API
  const { data: plans, isLoading: plansLoading } = usePlans();

  // Ads API
  const { data: ads, isLoading: adsLoading } = useAds();

  // Notifications API
  const { data: notifications, isLoading: notificationsLoading } = useNotifications();

  const handleUpdateUserStatus = async (userId: number, status: string) => {
    try {
      await updateUserStatus.mutateAsync({ id: userId, status });
      console.log('User status updated successfully');
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser.mutateAsync(userId);
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (usersLoading || statsLoading || dashboardLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (usersError) {
    return <div className="p-4 text-red-500">Error loading users: {usersError.message}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">API Integration Example</h1>
      
      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border rounded-md"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Trial">Trial</option>
          <option value="Expired">Expired</option>
        </select>
      </div>

      {/* User Statistics */}
      {userStats && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">User Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{userStats.totalUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold">{userStats.activeUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Trial Users</p>
              <p className="text-2xl font-bold">{userStats.trialUsers}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Churn Rate</p>
              <p className="text-2xl font-bold">{userStats.churnRate}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Statistics */}
      {dashboardStats && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Dashboard Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Scans</p>
              <p className="text-2xl font-bold">{dashboardStats.activeScans}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">System Health</p>
              <p className="text-2xl font-bold">{dashboardStats.systemHealth}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      {users && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Users ({users.total})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Company</th>
                  <th className="px-4 py-2 text-left">Plan</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.data.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.company}</td>
                    <td className="px-4 py-2">{user.plan}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.status === 'Active' ? 'bg-green-100 text-green-800' :
                        user.status === 'Trial' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateUserStatus(user.id, 'Inactive')}
                          className="px-2 py-1 bg-yellow-500 text-white rounded text-xs"
                          disabled={updateUserStatus.isPending}
                        >
                          {updateUserStatus.isPending ? 'Updating...' : 'Deactivate'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          disabled={deleteUser.isPending}
                        >
                          {deleteUser.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security Tools */}
      {securityTools && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Security Tools ({securityTools.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {securityTools.map((tool) => (
              <div key={tool.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{tool.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    tool.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tool.status}
                  </span>
                  <span className="text-xs text-gray-500">{tool.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plans */}
      {plans && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Service Plans ({plans.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-2xl font-bold text-blue-600">${plan.price}</p>
                <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                <div className="flex items-center gap-2">
                  {plan.isPopular && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      Popular
                    </span>
                  )}
                  <span className={`px-2 py-1 rounded text-xs ${
                    plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {plan.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

