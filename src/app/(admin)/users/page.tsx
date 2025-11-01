"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import UsersTable from "@/components/tables/UsersTable";
import Pagination from "@/components/tables/Pagination";
import { useUsers } from "@/hooks/api/useUsers";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Debounce search term - wait 1 second after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch users data with pagination and filters
  const { data: usersData, isLoading } = useUsers({
    page: currentPage,
    limit: rowsPerPage,
    search: debouncedSearchTerm || undefined,
    status: statusFilter || undefined,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newLimit: number) => {
    setRowsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when status filter changes
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Software Users Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor all your application users</p>
        </div>
        <div className="flex gap-3">
          {/* Action buttons can be added here if needed */}
        </div>
      </div>

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Users Table */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800">
          <div className="px-4 py-6 sm:px-6 xl:px-7.5">
            
            
            {/* Search and Filter Section */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              {/* Search Input */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search Users
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name, email..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                />
                {searchTerm && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {debouncedSearchTerm === searchTerm ? 'Searching...' : 'Type to search (1s delay)'}
                  </p>
                )}
              </div>
              
              {/* Status Filter */}
              <div className="sm:w-56">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Filter by Status
                </label>
                <div className="relative">
                  <select
                    id="status"
                    value={statusFilter}
                    onChange={handleStatusChange}
                    className="w-full px-4 py-2.5 pr-10 appearance-none border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all cursor-pointer"
                  >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Trial">Trial</option>
                    <option value="Expired">Expired</option>
                  </select>
                  {/* Custom Dropdown Arrow */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400 dark:text-gray-500 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {/* Status Indicator Badge */}
                {statusFilter && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusFilter === 'Active'
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                          : statusFilter === 'Inactive'
                          ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          : statusFilter === 'Trial'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          statusFilter === 'Active'
                            ? 'bg-orange-600 dark:bg-orange-400'
                            : statusFilter === 'Inactive'
                            ? 'bg-gray-600 dark:bg-gray-400'
                            : statusFilter === 'Trial'
                            ? 'bg-blue-600 dark:bg-blue-400'
                            : 'bg-red-600 dark:bg-red-400'
                        }`}
                      />
                      Filtering: {statusFilter}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="px-4 pb-6 sm:px-6 xl:px-7.5">
            <UsersTable 
              page={currentPage} 
              limit={rowsPerPage}
              search={debouncedSearchTerm || undefined}
              status={statusFilter || undefined}
            />
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 xl:px-7.5">
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-400">
                {isLoading ? (
                  "Loading..."
                ) : usersData ? (
                  `Showing ${((currentPage - 1) * rowsPerPage) + 1} to ${Math.min(currentPage * rowsPerPage, usersData.total)} of ${usersData.total} entries`
                ) : (
                  "No data available"
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 dark:text-gray-400">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
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
