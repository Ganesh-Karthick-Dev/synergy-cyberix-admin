"use client";
import React from 'react';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import Button from '../ui/button/Button';

export default function ErrorTest() {
  const { handleError } = useApiErrorHandler();

  const simulateUserAlreadyLoggedInError = () => {
    const mockError = {
      response: {
        status: 409,
        data: {
          success: false,
          error: {
            message: "Another user is already logged in with this account. Please logout from other devices first or contact support.",
            statusCode: 409,
            code: "USER_ALREADY_LOGGED_IN"
          }
        }
      }
    };
    
    handleError(mockError);
  };

  const simulateGenericError = () => {
    const mockError = {
      response: {
        status: 500,
        data: {
          success: false,
          error: {
            message: "Internal server error occurred",
            statusCode: 500,
            code: "INTERNAL_SERVER_ERROR"
          }
        }
      }
    };
    
    handleError(mockError);
  };

  const simulateNetworkError = () => {
    const mockError = {
      message: "Network Error",
      code: "NETWORK_ERROR"
    };
    
    handleError(mockError);
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-4">Error Handling Test</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Click the buttons below to test different error scenarios and see how they are handled.
      </p>
      
      <div className="space-y-3">
        <Button
          onClick={simulateUserAlreadyLoggedInError}
          className="w-full bg-red-500 hover:bg-red-600"
        >
          Test USER_ALREADY_LOGGED_IN Error
        </Button>
        
        <Button
          onClick={simulateGenericError}
          variant="outline"
          className="w-full"
        >
          Test Generic Server Error
        </Button>
        
        <Button
          onClick={simulateNetworkError}
          variant="outline"
          className="w-full"
        >
          Test Network Error
        </Button>
      </div>
    </div>
  );
}
