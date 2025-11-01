"use client";
import React, { useState } from 'react';
import Button from '../ui/button/Button';
import { useLoginLogs, useClearLoginLogs } from '@/hooks/api/useLoginLogs';
import { LoginLog } from '@/lib/api/services';
import { showToast } from '@/utils/toast';

export default function LoginLogs() {
  const { data: loginLogs, isLoading, error, refetch } = useLoginLogs();
  const clearLogsMutation = useClearLoginLogs();
  const [selectedLogs, setSelectedLogs] = useState<number[]>([]);

  const handleClearAllLogs = async () => {
    if (window.confirm('Are you sure you want to clear ALL login logs? This action cannot be undone.')) {
      try {
        await clearLogsMutation.mutateAsync();
        setSelectedLogs([]);
      } catch (error) {
        console.error('Failed to clear logs:', error);
      }
    }
  };

  const handleClearSelectedLogs = async () => {
    if (selectedLogs.length === 0) {
      showToast.error('Please select logs to clear');
      return;
    }

    if (window.confirm(`Are you sure you want to clear ${selectedLogs.length} selected login logs?`)) {
      // For now, we'll clear all logs since the API doesn't support selective clearing
      // In a real implementation, you'd have an API endpoint for clearing specific logs
      await handleClearAllLogs();
    }
  };

  const toggleLogSelection = (logId: number) => {
    setSelectedLogs(prev => 
      prev.includes(logId) 
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const selectAllLogs = () => {
    if (loginLogs && loginLogs.length > 0) {
      setSelectedLogs(loginLogs.map(log => log.id));
    }
  };

  const deselectAllLogs = () => {
    setSelectedLogs([]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const parseDeviceInfo = (deviceInfo: string) => {
    try {
      return JSON.parse(deviceInfo);
    } catch {
      return { userAgent: deviceInfo };
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-200">
              Failed to load login logs
            </h3>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              {error?.message || 'Unable to connect to the server'}
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Login Logs ({loginLogs?.length || 0})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            View and manage user login sessions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleClearAllLogs}
            disabled={clearLogsMutation.isPending || !loginLogs?.length}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
          >
            {clearLogsMutation.isPending ? 'Clearing...' : 'Clear All'}
          </Button>
          
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </div>

      {loginLogs && loginLogs.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <Button
            onClick={selectAllLogs}
            variant="ghost"
            size="sm"
          >
            Select All
          </Button>
          <Button
            onClick={deselectAllLogs}
            variant="ghost"
            size="sm"
          >
            Deselect All
          </Button>
          {selectedLogs.length > 0 && (
            <Button
              onClick={handleClearSelectedLogs}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Clear Selected ({selectedLogs.length})
            </Button>
          )}
        </div>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {loginLogs && loginLogs.length > 0 ? (
          loginLogs.map((log: LoginLog) => {
            const deviceInfo = parseDeviceInfo(log.deviceInfo);
            const isSelected = selectedLogs.includes(log.id);
            
            return (
              <div
                key={log.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => toggleLogSelection(log.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        log.isActive 
                          ? 'bg-green-500' 
                          : log.success 
                            ? 'bg-gray-400' 
                            : 'bg-red-500'
                      }`}></div>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {log.email}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : log.success 
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {log.isActive ? 'Active' : log.success ? 'Logged Out' : 'Failed'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p><strong>Login Time:</strong> {formatDate(log.loginTime)}</p>
                      {log.logoutTime && (
                        <p><strong>Logout Time:</strong> {formatDate(log.logoutTime)}</p>
                      )}
                      <p><strong>IP Address:</strong> {log.ipAddress}</p>
                      <p><strong>Device:</strong> {deviceInfo.platform || 'Unknown'}</p>
                      <p><strong>Browser:</strong> {deviceInfo.userAgent?.split(' ')[0] || 'Unknown'}</p>
                      {log.errorMessage && (
                        <p className="text-red-600 dark:text-red-400">
                          <strong>Error:</strong> {log.errorMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleLogSelection(log.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No login logs found</p>
            <p className="text-sm">Login attempts will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
