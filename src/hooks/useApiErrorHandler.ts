"use client";
import { useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

export const useApiErrorHandler = () => {
  const { handleApiError } = useErrorHandler();

  const handleError = useCallback((error: any) => {
    // Check if it's the specific USER_ALREADY_LOGGED_IN error
    if (error?.response?.data?.error?.code === 'USER_ALREADY_LOGGED_IN') {
      handleApiError(error);
      return;
    }

    // Check for other structured API errors
    if (error?.response?.data?.error) {
      handleApiError(error);
      return;
    }

    // Handle network errors
    if (!error.response) {
      handleApiError(error);
      return;
    }

    // Handle other HTTP errors
    handleApiError(error);
  }, [handleApiError]);

  return { handleError };
};
