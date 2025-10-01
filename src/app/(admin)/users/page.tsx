"use client";
import React, { useState } from "react";
import { Metadata } from "next";
import UsersTable from "@/components/tables/UsersTable";
import Pagination from "@/components/tables/Pagination";
import { showToast } from "@/utils/toast";

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5; // Example total pages

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
              <a className="font-medium" href="/">
                Dashboard /
              </a>
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
          </div>
          
          <div className="px-4 pb-6 sm:px-6 xl:px-7.5">
            <UsersTable />
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 xl:px-7.5">
            <div className="text-sm text-gray-700 dark:text-gray-400">
              Showing 1 to 5 of 25 entries
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
