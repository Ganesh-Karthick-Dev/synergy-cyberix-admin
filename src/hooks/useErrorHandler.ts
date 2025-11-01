"use client";
import { useState, useCallback } from 'react';
import { showToast } from '@/utils/toast';

interface ApiError {
  message: string;
  statusCode: number;
  code: string;
}

interface ErrorHandlerState {
  isErrorModalOpen: boolean;
  currentError: ApiError | null;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorHandlerState>({
    isErrorModalOpen: false,
    currentError: null
  });

  const handleApiError = useCallback((error: any) => {
    console.error('🚨 API Error:', error);

    // Extract error information
    let errorInfo: ApiError;
    
    if (error?.response?.data?.error) {
      // Structured API error response
      errorInfo = {
        message: error.response.data.error.message,
        statusCode: error.response.data.error.statusCode || error.response.status,
        code: error.response.data.error.code || 'UNKNOWN_ERROR'
      };
    } else if (error?.response?.data) {
      // Direct error response
      errorInfo = {
        message: error.response.data.message || error.message || 'An unexpected error occurred',
        statusCode: error.response.status,
        code: error.response.data.code || 'HTTP_ERROR'
      };
    } else {
      // Network or other errors
      errorInfo = {
        message: error.message || 'Network error occurred',
        statusCode: error.status || 0,
        code: 'NETWORK_ERROR'
      };
    }

    // Show appropriate error handling based on error type
    switch (errorInfo.statusCode) {
      case 409:
        if (errorInfo.code === 'USER_ALREADY_LOGGED_IN') {
          // Show professional modal for this specific error
          setErrorState({
            isErrorModalOpen: true,
            currentError: errorInfo
          });
          return;
        }
        break;
      
      case 401:
        // Unauthorized - redirect to login
        showToast.error('Session expired. Please login again.');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 2000);
        return;
      
      case 403:
        // Forbidden
        showToast.error('You do not have permission to perform this action.');
        return;
      
      case 500:
        // Server error
        showToast.error('Server error. Please try again later.');
        return;
      
      default:
        // Show generic error modal for other errors
        setErrorState({
          isErrorModalOpen: true,
          currentError: errorInfo
        });
        return;
    }

    // Fallback to toast notification
    showToast.error(errorInfo.message);
  }, []);

  const closeErrorModal = useCallback(() => {
    setErrorState({
      isErrorModalOpen: false,
      currentError: null
    });
  }, []);

  const retryAction = useCallback(() => {
    closeErrorModal();
    // You can add retry logic here
    window.location.reload();
  }, [closeErrorModal]);

  const contactSupport = useCallback(() => {
    // Create a detailed support email with error information
    const subject = 'Technical Support Request - Login Issue';
    const body = `Hello Support Team,

I'm experiencing a login issue with the following details:

Error Code: ${errorState.currentError?.code || 'Unknown'}
Error Message: ${errorState.currentError?.message || 'No message'}
Status Code: ${errorState.currentError?.statusCode || 'Unknown'}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}

Please help me resolve this issue.

Best regards,
[Your Name]`;

    const mailtoLink = `mailto:support@cyberix.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, '_blank');
    closeErrorModal();
  }, [closeErrorModal, errorState.currentError]);

  return {
    errorState,
    handleApiError,
    closeErrorModal,
    retryAction,
    contactSupport
  };
};
