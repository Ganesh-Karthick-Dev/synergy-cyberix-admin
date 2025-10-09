'use client';

import React from 'react';
import { ApiExample } from '@/components/examples/ApiExample';

export default function ApiDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <ApiExample />
      </div>
    </div>
  );
}

