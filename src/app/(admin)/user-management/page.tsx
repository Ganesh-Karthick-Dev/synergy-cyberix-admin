'use client';

import React from 'react';
import { UserManagement } from '@/components/user-management/UserManagement';

export default function UserManagementPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserManagement />
    </div>
  );
}