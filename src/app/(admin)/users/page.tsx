"use client";
import React, { useState } from "react";
import Link from "next/link";
import UsersTable from "@/components/tables/UsersTable";
import Pagination from "@/components/tables/Pagination";
import { useUsers } from "@/hooks/api/useUsers";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Fetch users data with pagination and filters
  const { data: usersData, isLoading } = useUsers({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    status: statusFilter || undefined,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Software Users Management
        </h2>
        <nav>
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href="/">
                Dashboard /
              </Link>
            </li>
            <li className="font-medium text-primary">Users</li>
          </ol>
        </nav>
      </div>

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Users Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800">
          <div className="px-4 py-6 sm:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Software Download Users
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage users who have downloaded your security scanning software and their subscription details
            </p>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">New Feature</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Click the <span className="font-medium">👤 View Full Profile (API)</span> button to see real user data including login activity, sessions, and security statistics from the database.
              </p>
            </div>
          </div>
          
          <div className="px-4 pb-6 sm:px-6 xl:px-7.5">
            <UsersTable />
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 xl:px-7.5">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              {isLoading ? (
                "Loading..."
              ) : usersData ? (
                `Showing ${((currentPage - 1) * 10) + 1} to ${Math.min(currentPage * 10, usersData.total)} of ${usersData.total} entries`
              ) : (
                "No data available"
              )}
            </div>
            {usersData && (
              <Pagination
                currentPage={currentPage}
                totalPages={usersData.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
