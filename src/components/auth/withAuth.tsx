"use client";
import React from 'react';

interface WithAuthOptions {
  requireAdmin?: boolean;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const WrappedComponent = (props: P) => {
    // Simply render the component without any authentication checks
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withAuth(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

export default withAuth;
