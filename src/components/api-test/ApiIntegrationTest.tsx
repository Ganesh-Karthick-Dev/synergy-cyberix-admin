'use client';

import React, { useState } from 'react';
import { useUsers, useUserStats } from '@/hooks/api/useUserManagement';
import { usePlans } from '@/hooks/api/useServicePlans';
import { useSecurityTools, useToolCategories } from '@/hooks/api/useSecurityTools';

export const ApiIntegrationTest: React.FC = () => {
  const [testResults, setTestResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  // Test all API endpoints
  const { data: users, isLoading: usersLoading, error: usersError } = useUsers({ page: 1, limit: 5 });
  const { data: userStats, isLoading: statsLoading, error: statsError } = useUserStats();
  const { data: plans, isLoading: plansLoading, error: plansError } = usePlans();
  const { data: tools, isLoading: toolsLoading, error: toolsError } = useSecurityTools();
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useToolCategories();

  const runApiTests = async () => {
    setIsLoading(true);
    const results: any = {};

    try {
      // Test API connectivity
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}/health`);
      results.healthCheck = {
        status: response.ok ? 'PASS' : 'FAIL',
        statusCode: response.status,
        message: response.ok ? 'API is reachable' : 'API is not reachable'
      };
    } catch (error) {
      results.healthCheck = {
        status: 'FAIL',
        message: 'API is not reachable',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    setTestResults(results);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PASS':
        return 'text-green-600 bg-green-100';
      case 'FAIL':
        return 'text-red-600 bg-red-100';
      case 'LOADING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return '✅';
      case 'FAIL':
        return '❌';
      case 'LOADING':
        return '⏳';
      default:
        return '❓';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">API Integration Test</h1>
        <button
          onClick={runApiTests}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Run API Tests'}
        </button>
      </div>

      {/* API Configuration */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Base URL</label>
            <p className="text-sm text-gray-900 font-mono">
              {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Environment</label>
            <p className="text-sm text-gray-900">{process.env.NODE_ENV}</p>
          </div>
        </div>
      </div>

      {/* Health Check Results */}
      {testResults.healthCheck && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Health Check Results</h2>
          <div className={`p-4 rounded-lg ${getStatusColor(testResults.healthCheck.status)}`}>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{getStatusIcon(testResults.healthCheck.status)}</span>
              <div>
                <div className="font-semibold">API Health Check: {testResults.healthCheck.status}</div>
                <div className="text-sm">{testResults.healthCheck.message}</div>
                {testResults.healthCheck.statusCode && (
                  <div className="text-sm">Status Code: {testResults.healthCheck.statusCode}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Real API Data Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users API Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Users API Test</h3>
          <div className={`p-3 rounded-lg ${getStatusColor(usersLoading ? 'LOADING' : usersError ? 'FAIL' : 'PASS')}`}>
            <div className="flex items-center">
              <span className="text-xl mr-2">
                {getStatusIcon(usersLoading ? 'LOADING' : usersError ? 'FAIL' : 'PASS')}
              </span>
              <div>
                <div className="font-semibold">
                  GET /api/users - {usersLoading ? 'Loading...' : usersError ? 'Failed' : 'Success'}
                </div>
                {users && (
                  <div className="text-sm">
                    Found {users.total} users, showing {users.users.length} on page {users.page}
                  </div>
                )}
                {usersError && (
                  <div className="text-sm text-red-600">{usersError.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* User Stats API Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">User Stats API Test</h3>
          <div className={`p-3 rounded-lg ${getStatusColor(statsLoading ? 'LOADING' : statsError ? 'FAIL' : 'PASS')}`}>
            <div className="flex items-center">
              <span className="text-xl mr-2">
                {getStatusIcon(statsLoading ? 'LOADING' : statsError ? 'FAIL' : 'PASS')}
              </span>
              <div>
                <div className="font-semibold">
                  GET /api/users/stats/overview - {statsLoading ? 'Loading...' : statsError ? 'Failed' : 'Success'}
                </div>
                {userStats && (
                  <div className="text-sm">
                    Total Users: {userStats.totalUsers}, Active: {userStats.activeUsers}
                  </div>
                )}
                {statsError && (
                  <div className="text-sm text-red-600">{statsError.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Service Plans API Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Service Plans API Test</h3>
          <div className={`p-3 rounded-lg ${getStatusColor(plansLoading ? 'LOADING' : plansError ? 'FAIL' : 'PASS')}`}>
            <div className="flex items-center">
              <span className="text-xl mr-2">
                {getStatusIcon(plansLoading ? 'LOADING' : plansError ? 'FAIL' : 'PASS')}
              </span>
              <div>
                <div className="font-semibold">
                  GET /api/plans - {plansLoading ? 'Loading...' : plansError ? 'Failed' : 'Success'}
                </div>
                {plans && (
                  <div className="text-sm">
                    Found {plans.length} service plans
                  </div>
                )}
                {plansError && (
                  <div className="text-sm text-red-600">{plansError.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Tools API Test */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Security Tools API Test</h3>
          <div className={`p-3 rounded-lg ${getStatusColor(toolsLoading ? 'LOADING' : toolsError ? 'FAIL' : 'PASS')}`}>
            <div className="flex items-center">
              <span className="text-xl mr-2">
                {getStatusIcon(toolsLoading ? 'LOADING' : toolsError ? 'FAIL' : 'PASS')}
              </span>
              <div>
                <div className="font-semibold">
                  GET /api/security-tools - {toolsLoading ? 'Loading...' : toolsError ? 'Failed' : 'Success'}
                </div>
                {tools && (
                  <div className="text-sm">
                    Found {tools.length} security tools
                  </div>
                )}
                {toolsError && (
                  <div className="text-sm text-red-600">{toolsError.message}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real Data Preview */}
      {(users || userStats || plans || tools) && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Real API Data Preview</h2>
          
          {users && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Users Data (First 3 users):</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(users.users.slice(0, 3), null, 2)}
                </pre>
              </div>
            </div>
          )}

          {userStats && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">User Statistics:</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(userStats, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {plans && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Service Plans (First 2 plans):</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(plans.slice(0, 2), null, 2)}
                </pre>
              </div>
            </div>
          )}

          {tools && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Security Tools (First 2 tools):</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <pre className="text-xs text-gray-700 overflow-x-auto">
                  {JSON.stringify(tools.slice(0, 2), null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Integration Instructions</h3>
        <div className="text-blue-800 space-y-2">
          <p>1. Make sure your API server is running on <code className="bg-blue-100 px-1 rounded">http://localhost:9000</code></p>
          <p>2. Check that all endpoints are responding correctly</p>
          <p>3. Verify that the data structure matches the API documentation</p>
          <p>4. If you see errors, check the browser console for detailed error messages</p>
        </div>
      </div>
    </div>
  );
};

