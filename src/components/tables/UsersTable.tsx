import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Tooltip from "../ui/tooltip/Tooltip";
import { showToast } from "@/utils/toast";
import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/api/useUsers";
import { User } from "@/lib/api/services";
import UserProfileModal from "./UserProfileModal";

// Default avatar for users without profile images
const defaultAvatar = "/images/user/default-avatar.jpg";

interface UsersTableProps {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export default function UsersTable({ page = 1, limit = 10, search, status }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [modalImageError, setModalImageError] = useState<boolean>(false);
  const [editImageError, setEditImageError] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Generate user initials
  const getUserInitials = (user: User): string => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user.firstName) {
      return user.firstName.substring(0, 2).toUpperCase();
    }
    if (user.name) {
      const parts = user.name.split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Generate consistent color based on user name
  const getAvatarColor = (user: User): string => {
    const name = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.name || user.email || 'User';
    
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500',
      'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-orange-500',
      'bg-teal-500', 'bg-cyan-500'
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const handleImageError = (userId: string) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }));
  };

  // Fetch users data from API with search and status filters
  const { data: usersData, isLoading, error } = useUsers({
    page,
    limit,
    search,
    status,
  });

  // Mutations
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();


  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
    setModalImageError(false); // Reset image error when opening modal
  };

  const handleViewProfile = (user: User) => {
    setSelectedUserEmail(user.email);
    setIsProfileModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    // Ensure all fields are properly initialized for the edit form
    const editData: User = {
      ...user,
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ').slice(1).join(' ') || '',
      email: user.email || '',
      phone: user.phone || '',
      company: user.company || '',
      location: user.location || '',
      bio: user.bio || '',
    };
    setEditFormData(editData);
    setIsEditModalOpen(true);
    setEditImageError(false); // Reset image error when opening modal
  };

  const handleSaveEdit = async () => {
    if (editFormData) {
      try {
        await updateUserMutation.mutateAsync({
          id: editFormData.id,
          data: editFormData
        });
        showToast.success("User profile updated successfully!");
        setIsEditModalOpen(false);
        setEditFormData(null);
      } catch (error) {
        showToast.error("Failed to update user profile");
      }
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUserMutation.mutateAsync(userToDelete.id);
        showToast.success("User deleted successfully!");
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        showToast.error("Failed to delete user");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-600 dark:text-red-400 mb-2">Failed to load users</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!usersData?.users || usersData.users.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-gray-800 shadow-sm dark:shadow-none">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-700">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Role
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Email Verified
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {usersData.users.map((user: User) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  {/* User Info */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-white/10 flex-shrink-0">
                        {user.avatar && !imageErrors[user.id] ? (
                          <Image
                            src={user.avatar}
                            alt={`${user.firstName} ${user.lastName}`}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                            onError={() => handleImageError(user.id)}
                          />
                        ) : (
                          <div
                            className={`h-full w-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(user)}`}
                          >
                            {getUserInitials(user)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                        {user.username && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            @{user.username}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Role */}
                  <TableCell className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' 
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
                    }`}>
                      {user.role}
                    </span>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'Active' || user.status === 'ACTIVE'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : user.status === 'Inactive' || user.status === 'INACTIVE'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : user.status === 'Trial'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>

                  {/* Email Verified */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {user.emailVerified ? (
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Verified
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-red-600 dark:text-red-400">
                            Not Verified
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="px-5 py-4">
                    <p className="text-gray-900 dark:text-white">
                      {user.phone || 'Not provided'}
                    </p>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Tooltip content="View Basic Info" position="top">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>
                      </Tooltip>
                      
                      <Tooltip content="View Full Profile (API)" position="top">
                        <button 
                          onClick={() => handleViewProfile(user)}
                          className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 p-1 rounded hover:bg-green-50 dark:hover:bg-green-500/10 transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </button>
                      </Tooltip>
                      
                      <Tooltip content="Edit Profile" position="top">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 p-1 rounded hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </Tooltip>
                      
                      <Tooltip content="Delete User" position="top">
                        <button 
                          onClick={() => handleDeleteUser(user)}
                          disabled={deleteUserMutation.isPending}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* View User Profile Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        className="w-[80%] max-w-5xl shadow-2xl"
      >
        {selectedUser && (
          <div className="p-8 lg:p-10">
            {/* Header Section with Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 overflow-hidden rounded-full ring-4 ring-gray-100 dark:ring-gray-800 shadow-lg">
                  {selectedUser.avatar && !modalImageError ? (
                    <Image
                      src={selectedUser.avatar}
                      alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      onError={() => setModalImageError(true)}
                    />
                  ) : (
                    <div
                      className={`h-full w-full flex items-center justify-center text-white font-bold text-2xl ${getAvatarColor(selectedUser)}`}
                    >
                      {getUserInitials(selectedUser)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">{selectedUser.email}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedUser.status === 'Active' || selectedUser.status === 'ACTIVE'
                      ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                      : selectedUser.status === 'Inactive' || selectedUser.status === 'INACTIVE'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {selectedUser.status}
                  </span>
                  {selectedUser.plan && (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
                      {selectedUser.plan}
                    </span>
                  )}
                  {selectedUser.role && (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {selectedUser.role}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-5">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Contact Information
                  </Label>
                  <div className="space-y-4 mt-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedUser.phone || <span className="text-gray-400 italic">Not provided</span>}
                      </p>
                    </div>
                    {selectedUser.location && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Location</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.location}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Account Details
                  </Label>
                  <div className="space-y-4 mt-3">
                    {selectedUser.company && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Company</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedUser.company}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">User ID</p>
                      <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{selectedUser.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Activity Information
                  </Label>
                  <div className="space-y-4 mt-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Last Scan</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedUser.lastScan || <span className="text-gray-400 italic">Never</span>}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Scans Completed</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedUser.scansCompleted || 0}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Biography
                    </Label>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="w-[80%] max-w-5xl shadow-2xl"
      >
        {editFormData && (
          <div className="p-8 lg:p-10">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 mb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 overflow-hidden rounded-full ring-4 ring-gray-100 dark:ring-gray-800 shadow-lg">
                  {editFormData.avatar && !editImageError ? (
                    <Image
                      src={editFormData.avatar}
                      alt={`${editFormData.firstName} ${editFormData.lastName}`}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                      onError={() => setEditImageError(true)}
                    />
                  ) : (
                    <div
                      className={`h-full w-full flex items-center justify-center text-white font-bold text-2xl ${getAvatarColor(editFormData)}`}
                    >
                      {getUserInitials(editFormData)}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Edit User Profile
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Update user information below
                </p>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-5">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Personal Information
                    </Label>
                    <div className="space-y-4 mt-3">
                      <div>
                        <Label className="mb-2">First Name</Label>
                        <Input
                          type="text"
                          value={editFormData.firstName || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            firstName: e.target.value
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Last Name</Label>
                        <Input
                          type="text"
                          value={editFormData.lastName || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            lastName: e.target.value
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Contact Information
                    </Label>
                    <div className="space-y-4 mt-3">
                      <div>
                        <Label className="mb-2">Email</Label>
                        <Input
                          type="email"
                          value={editFormData.email || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            email: e.target.value
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Phone</Label>
                        <Input
                          type="text"
                          value={editFormData.phone || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            phone: e.target.value
                          })}
                          className="w-full"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-5">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Additional Information
                    </Label>
                    <div className="space-y-4 mt-3">
                      <div>
                        <Label className="mb-2">Company</Label>
                        <Input
                          type="text"
                          value={editFormData.company || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            company: e.target.value
                          })}
                          className="w-full"
                          placeholder="Enter company name"
                        />
                      </div>
                      <div>
                        <Label className="mb-2">Location</Label>
                        <Input
                          type="text"
                          value={editFormData.location || ''}
                          onChange={(e) => setEditFormData({
                            ...editFormData,
                            location: e.target.value
                          })}
                          className="w-full"
                          placeholder="Enter location"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <Label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Biography
                    </Label>
                    <div className="mt-3">
                      <textarea
                        value={editFormData.bio || ''}
                        onChange={(e) => setEditFormData({
                          ...editFormData,
                          bio: e.target.value
                        })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                        placeholder="Enter user biography..."
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="px-6"
                >
                  {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        className="max-w-md shadow-2xl"
      >
        {userToDelete && (
          <div className="p-8">
            <div className="text-center mb-6">
              {/* Warning Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Delete User?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
              
              {/* User Info Card */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-white/10 flex-shrink-0">
                    {userToDelete.avatar && !imageErrors[userToDelete.id] ? (
                      <Image
                        src={userToDelete.avatar}
                        alt={`${userToDelete.firstName} ${userToDelete.lastName}`}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        onError={() => handleImageError(userToDelete.id)}
                      />
                    ) : (
                      <div
                        className={`h-full w-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(userToDelete)}`}
                      >
                        {getUserInitials(userToDelete)}
                      </div>
                    )}
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {userToDelete.firstName} {userToDelete.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {userToDelete.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="button"
                onClick={confirmDelete}
                disabled={deleteUserMutation.isPending}
                className="flex-1 px-4 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700 dark:bg-red-600 dark:hover:bg-red-700"
              >
                {deleteUserMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  'Delete User'
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* User Profile Modal - Shows real API data */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userEmail={selectedUserEmail}
        userName={selectedUser?.name}
      />
    </div>
  );
}
