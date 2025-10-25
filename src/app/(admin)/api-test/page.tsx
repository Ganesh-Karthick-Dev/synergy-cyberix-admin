'use client';

import React from 'react';
import { ApiIntegrationTest } from '@/components/api-test/ApiIntegrationTest';
import { AuthApiTest } from '@/components/api-test/AuthApiTest';
import { BackendApiTest } from '@/components/api-test/BackendApiTest';
import { ApiConfigTest } from '@/components/api-test/ApiConfigTest';
import { CookieTest } from '@/components/api-test/CookieTest';

export default function ApiTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 space-y-8">
        <ApiConfigTest />
        <CookieTest />
        <BackendApiTest />
        <AuthApiTest />
        <ApiIntegrationTest />
      </div>
    </div>
  );
}

