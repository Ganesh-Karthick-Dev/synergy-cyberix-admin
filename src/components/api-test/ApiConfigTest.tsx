'use client';

import React, { useState, useEffect } from 'react';
import { ENV_CONFIG } from '@/lib/api/env-config';

export function ApiConfigTest() {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setConfig({
      apiBaseUrl: ENV_CONFIG.API_BASE_URL,
      envApiUrl: process.env.NEXT_PUBLIC_API_URL,
      nodeEnv: process.env.NODE_ENV,
      isDevelopment: ENV_CONFIG.IS_DEVELOPMENT,
    });
  }, []);

  const testApiCall = async () => {
    try {
      const response = await fetch(`${ENV_CONFIG.API_BASE_URL}/health`);
      const data = await response.json();
      alert(`API Test Success!\nURL: ${ENV_CONFIG.API_BASE_URL}/health\nResponse: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      alert(`API Test Failed!\nURL: ${ENV_CONFIG.API_BASE_URL}/health\nError: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">API Configuration Test</h2>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Current Configuration</h3>
        {config && (
          <div className="space-y-2 text-sm">
            <div><strong>API Base URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.apiBaseUrl}</code></div>
            <div><strong>Environment API URL:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.envApiUrl || 'Not set'}</code></div>
            <div><strong>Node Environment:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.nodeEnv}</code></div>
            <div><strong>Is Development:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{config.isDevelopment ? 'Yes' : 'No'}</code></div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <button
          onClick={testApiCall}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Test API Connection
        </button>
      </div>

      <div className="p-4 bg-yellow-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Expected Configuration</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• API Base URL should be: <code>http://localhost:9000</code></li>
          <li>• Environment API URL should be: <code>http://localhost:9000</code></li>
          <li>• Test button should successfully connect to your backend</li>
        </ul>
      </div>
    </div>
  );
}
