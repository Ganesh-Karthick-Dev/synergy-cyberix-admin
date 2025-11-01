'use client';

import React, { useState } from 'react';
import {
  useSecurityTools,
  useToolCategories,
  useToggleToolStatus,
  useDeployUpdates,
  useSecurityToolsWithSearch,
  useActiveSecurityTools,
  useInactiveSecurityTools,
  useScanningTools,
  useMonitoringTools,
  useAnalysisTools,
  useReportingTools,
} from '@/hooks/api/useSecurityTools';

export const SecurityTools: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Main tools query with filters
  const { data: tools, isLoading: toolsLoading, error: toolsError } = useSecurityTools({
    category: selectedCategory || undefined,
    search: searchTerm || undefined,
    status: selectedStatus || undefined,
  });

  // Tool categories
  const { data: categories, isLoading: categoriesLoading } = useToolCategories();

  // Mutations
  const toggleToolStatus = useToggleToolStatus();
  const deployUpdates = useDeployUpdates();

  // Specialized queries
  const { data: activeTools } = useActiveSecurityTools();
  const { data: inactiveTools } = useInactiveSecurityTools();
  const { data: scanningTools } = useScanningTools();
  const { data: monitoringTools } = useMonitoringTools();
  const { data: analysisTools } = useAnalysisTools();
  const { data: reportingTools } = useReportingTools();

  const handleToggleTool = async (toolId: string) => {
    try {
      await toggleToolStatus.mutateAsync(toolId);
      alert('Tool status toggled successfully!');
    } catch (error) {
      alert('Failed to toggle tool status');
    }
  };

  const handleDeployUpdates = async () => {
    if (confirm('Are you sure you want to deploy updates? This may affect running tools.')) {
      try {
        await deployUpdates.mutateAsync();
        alert('Updates deployed successfully!');
      } catch (error) {
        alert('Failed to deploy updates');
      }
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'scanning':
        return 'bg-blue-100 text-blue-800';
      case 'monitoring':
        return 'bg-green-100 text-green-800';
      case 'analysis':
        return 'bg-purple-100 text-purple-800';
      case 'reporting':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (toolsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading security tools...</div>
      </div>
    );
  }

  if (toolsError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Error Loading Tools</h3>
        <p className="text-red-600">{toolsError.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Security Tools Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and configure security scanning tools and utilities</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDeployUpdates}
            className="px-4 py-2 bg-brand-500 text-white rounded-md hover:bg-brand-600 flex items-center gap-2"
            disabled={deployUpdates.isPending}
          >
            {deployUpdates.isPending ? 'Deploying...' : 'Deploy Updates'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Search & Filter Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tools
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tools List */}
      {tools && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              Security Tools ({tools.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {tools.map((tool) => (
              <div key={tool.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{tool.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{tool.description}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(tool.category)}`}
                    >
                      {tool.category}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(tool.status)}`}
                    >
                      {tool.status}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {tool.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                    {tool.features.length > 3 && (
                      <li className="text-gray-500">+{tool.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Last updated: {tool.lastUpdated}</span>
                  <span className={`flex items-center ${tool.isEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    <span className={`w-2 h-2 rounded-full mr-1 ${tool.isEnabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    {tool.isEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleTool(tool.id)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                      tool.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                    disabled={toggleToolStatus.isPending}
                  >
                    {toggleToolStatus.isPending ? 'Toggling...' : tool.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Overview */}
      {categories && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tool Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(category.id)}`}
                >
                  {category.id}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specialized Queries Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Active Tools ({activeTools?.length || 0})</h3>
          <div className="space-y-2">
            {activeTools?.slice(0, 3).map((tool) => (
              <div key={tool.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.category}</div>
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Scanning Tools ({scanningTools?.length || 0})</h3>
          <div className="space-y-2">
            {scanningTools?.slice(0, 3).map((tool) => (
              <div key={tool.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.status}</div>
                </div>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Monitoring Tools ({monitoringTools?.length || 0})</h3>
          <div className="space-y-2">
            {monitoringTools?.slice(0, 3).map((tool) => (
              <div key={tool.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.status}</div>
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Analysis Tools ({analysisTools?.length || 0})</h3>
          <div className="space-y-2">
            {analysisTools?.slice(0, 3).map((tool) => (
              <div key={tool.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{tool.name}</div>
                  <div className="text-xs text-gray-500">{tool.status}</div>
                </div>
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
    </div>
  );
};

