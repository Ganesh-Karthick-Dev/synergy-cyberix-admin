"use client";
import React from 'react';
import { useAuthStatus } from '@/hooks/useAuthStatus';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuthStatus();

  // Helper function to check if user is admin
  const isAdminUser = (userEmail: string, userRole: string): boolean => {
    const adminEmails = ['webnox@admin.com', 'webnox1@admin.com'];
    return userRole === 'ADMIN' && adminEmails.includes(userEmail);
  };

  const adminEmails = ['webnox@admin.com', 'webnox1@admin.com'];
  const isCurrentUserAdmin = user ? isAdminUser(user.email, user.role) : false;

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Admin Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Info Card */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Admin Access Information</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Current User</h4>
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <div><strong>Email:</strong> {user?.email || 'Not logged in'}</div>
                <div><strong>Role:</strong> {user?.role || 'N/A'}</div>
                <div><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    isCurrentUserAdmin 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {isCurrentUserAdmin ? 'Authorized Admin' : 'Unauthorized'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Authorized Admin Emails</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {adminEmails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">✅</span>
                    <span>{email}</span>
                    {user?.email === email && (
                      <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 px-2 py-1 rounded">
                        Current User
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Features Card */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Security Features</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🔒 Login Security</h4>
              <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <div>✅ Account blocking after 3 failed attempts</div>
                <div>✅ 5-minute block duration</div>
                <div>✅ Real-time attempt tracking</div>
                <div>✅ Email notifications for suspicious activity</div>
                <div>✅ Automatic block cleanup</div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">👥 Admin Management</h4>
              <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                <div>✅ Dual admin support (2 authorized admins)</div>
                <div>✅ Role-based access control</div>
                <div>✅ Admin force logout capabilities</div>
                <div>✅ Session monitoring and management</div>
                <div>✅ Login logs and activity tracking</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints Card */}
      <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">API Endpoints</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Authentication</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>POST /api/auth/login</div>
              <div>POST /api/auth/logout</div>
              <div>POST /api/auth/logout-all</div>
              <div>GET /api/auth/session-status</div>
              <div>GET /api/auth/profile</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Blocking System</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>GET /api/auth/block-status/:email</div>
              <div>GET /api/auth/login-logs</div>
              <div>POST /api/auth/force-logout/:userId</div>
              <div>DELETE /api/auth/login-logs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Instructions */}
      <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Testing Instructions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Login Blocking Test</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div>1. Go to <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">/login-blocking-test</code></div>
              <div>2. Try wrong password 3 times</div>
              <div>3. Account gets blocked for 5 minutes</div>
              <div>4. Check email notifications</div>
              <div>5. Wait for block to expire</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Admin Access Test</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div>1. Login with <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">webnox@admin.com</code></div>
              <div>2. Should get admin access</div>
              <div>3. Logout and login with <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">webnox1@admin.com</code></div>
              <div>4. Should also get admin access</div>
              <div>5. Try with regular user - should be denied</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
