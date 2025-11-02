"use client";
import React from 'react';
import Button from '../ui/button/Button';
import { useLogout } from '@/hooks/api/useAuth';
import { useRouter } from 'next/navigation';
import { showToast } from '@/utils/toast';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

export default function LogoutButton({ 
  variant = 'outline', 
  size = 'sm', 
  className = '',
  children = 'Logout'
}: LogoutButtonProps) {
  const logoutMutation = useLogout();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear cookies immediately on client side
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      await logoutMutation.mutateAsync();
      showToast.success('Logged out successfully!');
      router.push('/signin');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails, clear cookies and redirect
      document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

      showToast.error('Logout failed, but redirecting to login...');
      router.push('/signin');
    }
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      variant={variant}
      size={size}
      className={className}
    >
      {logoutMutation.isPending ? 'Logging out...' : children}
    </Button>
  );
}
