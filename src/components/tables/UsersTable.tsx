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

export default function UsersTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<User | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedUserEmail, setSelectedUserEmail] = useState<string>("");

  // Fetch users data from API
  const { data: usersData, isLoading, error } = useUsers({
    page: 1,
    limit: 10,
  });

  // Mutations
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();


  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleViewProfile = (user: User) => {
    setSelectedUserEmail(user.email);
    setIsProfileModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditFormData({ ...user });
    setIsEditModalOpen(true);
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

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserMutation.mutateAsync(userId);
        showToast.success("User deleted successfully!");
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
  if (!usersData?.data || usersData.data.length === 0) {
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
              {usersData.data.map((user: User) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  {/* User Info */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-white/10">
                        <Image
                          src={user.avatar || defaultAvatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                        {user.username && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
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
                      user.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </TableCell>

                  {/* Email Verified */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${user.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {user.emailVerified ? '✅' : '❌'}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
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
                          className="text-brand-500 hover:text-brand-600 dark:text-brand-400 dark:hover:text-brand-300 p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-500/10 transition-colors"
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
                          onClick={() => handleDeleteUser(user.id)}
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
      >
        {selectedUser && (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 overflow-hidden rounded-full">
                <Image
                  src={selectedUser.avatar || defaultAvatar}
                  alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedUser.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                <Badge>
                  {selectedUser.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <p className="text-gray-900 dark:text-white">{selectedUser.company}</p>
              </div>
              <div>
                <Label>Plan</Label>
                <Badge>{selectedUser.plan}</Badge>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-gray-900 dark:text-white">{selectedUser.phone}</p>
              </div>
              <div>
                <Label>Location</Label>
                <p className="text-gray-900 dark:text-white">{selectedUser.location}</p>
              </div>
              <div>
                <Label>Last Scan</Label>
                <p className="text-gray-900 dark:text-white">{selectedUser.lastScan}</p>
              </div>
              <div>
                <Label>Scans Completed</Label>
                <p className="text-gray-900 dark:text-white">{selectedUser.scansCompleted}</p>
              </div>
              <div className="md:col-span-2">
                <Label>Bio</Label>
                <p className="text-gray-900 dark:text-white">{selectedUser.bio}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit User Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        {editFormData && (
          <div className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    defaultValue={editFormData.firstName}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      firstName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    defaultValue={editFormData.lastName}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      lastName: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    defaultValue={editFormData.email}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      email: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    type="text"
                    defaultValue={editFormData.phone || ''}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      phone: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Company</Label>
                  <Input
                    type="text"
                    defaultValue={editFormData.company}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      company: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label>Location</Label>
                  <Input
                    type="text"
                    defaultValue={editFormData.location}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      location: e.target.value
                    })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Bio</Label>
                  <Input
                    type="text"
                    defaultValue={editFormData.bio}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      bio: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3 mt-6 justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button size="sm">
                  Save Changes
                </Button>
              </div>
            </form>
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
