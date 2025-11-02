"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/loader/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has isAuthenticated cookie (non-HttpOnly cookie that JS can read)
    const cookies = document.cookie.split(';').map(c => c.trim());
    const isAuthenticated = cookies.some(cookie => cookie.startsWith('isAuthenticated='));

    if (isAuthenticated) {
      // User is authenticated, check admin status if required
      if (requireAdmin) {
        fetch('/api/auth/profile', { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.data) {
              const adminEmails = ['webnox@admin.com', 'webnox1@admin.com'];
              const isAdmin = data.data.role === 'ADMIN' && adminEmails.includes(data.data.email);
              if (isAdmin) {
                setIsLoading(false); // Allow access
              } else {
                router.push('/signin'); // Not admin, redirect
              }
            } else {
              router.push('/signin'); // Profile fetch failed
            }
          })
          .catch(() => {
            router.push('/signin'); // API error
          });
      } else {
        setIsLoading(false); // Allow access
      }
    } else {
      router.push('/signin'); // No cookie, redirect to login
    }
  }, [requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}