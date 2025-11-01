"use client";
import React from 'react';
import AuthGuard from './AuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  fallback = null 
}: ProtectedRouteProps) {
  return (
    <AuthGuard requireAdmin={requireAdmin}>
      {children}
    </AuthGuard>
  );
}
