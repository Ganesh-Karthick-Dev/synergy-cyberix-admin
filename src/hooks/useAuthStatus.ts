"use client";
import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/api/useAuth';

interface AuthStatus {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  user: any;
}

// Helper function to check if user is admin
const isAdminUser = (userEmail: string, userRole: string): boolean => {
  const adminEmails = ['webnox@admin.com', 'webnox1@admin.com'];
  return userRole === 'ADMIN' && adminEmails.includes(userEmail);
};

export function useAuthStatus(): AuthStatus {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { data: user, isLoading, error } = useProfile();

  useEffect(() => {
    // Check localStorage first for quick check
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    const storedUser = localStorage.getItem('user');
    
    if (storedAuth && storedUser) {
      setIsAuthenticated(true);
      
      // Check if user is admin
      try {
        const userData = JSON.parse(storedUser);
        const adminCheck = isAdminUser(userData.email, userData.role);
        setIsAdmin(adminCheck);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (user && !isLoading && !error) {
      setIsAuthenticated(true);
      const adminCheck = isAdminUser(user.email, user.role);
      setIsAdmin(adminCheck);
    } else if (error && !isLoading) {
      // If there's an error fetching profile, user is not authenticated
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  }, [user, isLoading, error]);

  return {
    isAuthenticated,
    isAdmin,
    isLoading,
    user: user || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null)
  };
}
