"use client";
import React from 'react';
import ErrorTest from '@/components/api-test/ErrorTest';

export default function ErrorTestPage() {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Error Handling Test
        </h2>
      </div>

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800">
          <div className="px-4 py-6 sm:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Professional Error Handling Demo
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Test different error scenarios to see how they are handled with professional modals
            </p>
          </div>
          
          <div className="px-4 pb-6 sm:px-6 xl:px-7.5">
            <ErrorTest />
          </div>
        </div>
      </div>
    </div>
  );
}
