"use client";
import React from 'react';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import ErrorModal from './ui/ErrorModal';

interface ErrorHandlerProps {
  children: React.ReactNode;
}

export default function ErrorHandler({ children }: ErrorHandlerProps) {
  const { errorState, closeErrorModal, retryAction, contactSupport } = useErrorHandler();

  return (
    <>
      {children}
      
      {/* Global Error Modal */}
      {errorState.currentError && (
        <ErrorModal
          isOpen={errorState.isErrorModalOpen}
          onClose={closeErrorModal}
          error={errorState.currentError}
          onRetry={retryAction}
          onContactSupport={contactSupport}
        />
      )}
    </>
  );
}
