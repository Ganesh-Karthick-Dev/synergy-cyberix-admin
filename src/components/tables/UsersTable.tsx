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

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: string;
  status: "Active" | "Inactive" | "Trial" | "Expired";
  lastScan: string;
  scansCompleted: number;
  avatar: string;
  phone?: string;
  location?: string;
  bio?: string;
}

// Define the users data - Software Downloaders
const usersData: User[] = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    company: "TechCorp Solutions",
    plan: "Professional",
    status: "Active",
    lastScan: "2 hours ago",
    scansCompleted: 45,
    avatar: "/images/user/user-17.jpg",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "IT Security Manager at TechCorp",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@startup.io",
    company: "StartupIO",
    plan: "Trial",
    status: "Trial",
    lastScan: "1 day ago",
    scansCompleted: 8,
    avatar: "/images/user/user-18.jpg",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, USA",
    bio: "Founder & CTO at StartupIO",
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike.chen@enterprise.com",
    company: "Enterprise Systems",
    plan: "Enterprise",
    status: "Active",
    lastScan: "3 hours ago",
    scansCompleted: 127,
    avatar: "/images/user/user-19.jpg",
    phone: "+1 (555) 345-6789",
    location: "Seattle, USA",
    bio: "Senior Security Engineer",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@freelance.com",
    company: "Freelance Consultant",
    plan: "Basic",
    status: "Expired",
    lastScan: "1 week ago",
    scansCompleted: 23,
    avatar: "/images/user/user-20.jpg",
    phone: "+1 (555) 456-7890",
    location: "Austin, USA",
    bio: "Independent Security Consultant",
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex.r@agency.com",
    company: "Digital Security Agency",
    plan: "Professional",
    status: "Active",
    lastScan: "30 minutes ago",
    scansCompleted: 89,
    avatar: "/images/user/user-21.jpg",
    phone: "+1 (555) 567-8901",
    location: "Miami, USA",
    bio: "Security Agency Director",
  },
];

export default function UsersTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<User | null>(null);


  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditFormData({ ...user });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editFormData) {
      showToast.success("User profile updated successfully!");
      setIsEditModalOpen(false);
      setEditFormData(null);
    }
  };

  const handleDeleteUser = () => {
    showToast.error("User deleted successfully!");
  };

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
                  Company
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Plan
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
                  Last Scan
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
              {usersData.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  {/* User Info */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-gray-200 dark:ring-white/10">
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="px-5 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {user.company}
                    </p>
                  </TableCell>

                  {/* Plan */}
                  <TableCell className="px-5 py-4">
                    <Badge>
                      {user.plan}
                    </Badge>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="px-5 py-4">
                    <Badge>
                      {user.status}
                    </Badge>
                  </TableCell>

                  {/* Last Scan */}
                  <TableCell className="px-5 py-4">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {user.lastScan}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.scansCompleted} scans
                      </p>
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Tooltip content="View Profile" position="top">
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
                          onClick={() => handleDeleteUser()}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
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
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
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
                    defaultValue={editFormData.name.split(' ')[0]}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      name: e.target.value + ' ' + editFormData.name.split(' ').slice(1).join(' ')
                    })}
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    defaultValue={editFormData.name.split(' ').slice(1).join(' ')}
                    onChange={(e) => setEditFormData({
                      ...editFormData,
                      name: editFormData.name.split(' ')[0] + ' ' + e.target.value
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
                    defaultValue={editFormData.phone}
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
    </div>
  );
}
