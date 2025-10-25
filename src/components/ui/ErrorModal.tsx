"use client";
import React from 'react';
import { Modal } from './modal';
import Button from './button/Button';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  error: {
    message: string;
    statusCode: number;
    code: string;
  };
  onRetry?: () => void;
  onContactSupport?: () => void;
}

export default function ErrorModal({ 
  isOpen, 
  onClose, 
  error, 
  onRetry, 
  onContactSupport 
}: ErrorModalProps) {
  const getErrorIcon = (code: string) => {
    switch (code) {
      case 'USER_ALREADY_LOGGED_IN':
        return (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getErrorTitle = (code: string) => {
    switch (code) {
      case 'USER_ALREADY_LOGGED_IN':
        return 'Account Already in Use';
      default:
        return 'Authentication Error';
    }
  };

  const getErrorDescription = (code: string, message: string) => {
    switch (code) {
      case 'USER_ALREADY_LOGGED_IN':
        return {
          primary: 'Your account is currently being used on another device or browser.',
          secondary: 'For security reasons, only one active session is allowed per account.',
          solution: 'Please logout from other devices or contact support if you need assistance.'
        };
      default:
        return {
          primary: message,
          secondary: 'Please try again or contact support if the problem persists.',
          solution: 'If this issue continues, please contact our support team.'
        };
    }
  };

  const errorInfo = getErrorDescription(error.code, error.message);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="p-6">
        {/* Error Icon */}
        {getErrorIcon(error.code)}
        
        {/* Error Content */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getErrorTitle(error.code)}
          </h3>
          
          <div className="mt-4 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {errorInfo.primary}
            </p>
            
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {errorInfo.secondary}
            </p>
            
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-3">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Solution:</strong> {errorInfo.solution}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          
          {onRetry && (
            <Button
              size="sm"
              onClick={onRetry}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
          )}
          
          {onContactSupport && (
            <Button
              size="sm"
              variant="outline"
              onClick={onContactSupport}
              className="w-full sm:w-auto border-blue-500 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              Contact Support
            </Button>
          )}
        </div>

        {/* Technical Details (Collapsible) */}
        <details className="mt-4">
          <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            Technical Details
          </summary>
          <div className="mt-2 rounded bg-gray-100 dark:bg-gray-800 p-2">
            <pre className="text-xs text-gray-600 dark:text-gray-300">
              {JSON.stringify({
                statusCode: error.statusCode,
                code: error.code,
                message: error.message
              }, null, 2)}
            </pre>
          </div>
        </details>
      </div>
    </Modal>
  );
}
