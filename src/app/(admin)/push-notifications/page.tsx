"use client";

import React, { useState } from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import { 
  Plus, 
  Eye, 
  Trash2, 
  Send, 
  Clock,
  Bell,
  Users,
  CheckCircle,
  Target,
  Search,
  Filter,
  X,
  ChevronDown,
  AlertCircle,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import { toast } from "react-hot-toast";
import { CustomSelect } from "@/components/ui/custom-select/CustomSelect";
import {
  useNotifications,
  useNotificationStats,
  useCreateNotification,
  useSendNotification,
  useDeleteNotification,
} from '@/hooks/api/useNotifications';
import { Notification } from '@/lib/api/services';

export default function PushNotifications() {
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success" | "error",
    targetAudience: "all" as "all" | "premium" | "trial" | "active",
    scheduledAt: ""
  });

  // API Hooks
  const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError } = useNotifications({
    search: searchTerm || undefined,
    status: selectedStatus || undefined,
    type: selectedType || undefined,
    targetAudience: selectedAudience || undefined,
  });

  // Ensure notifications is always an array
  const notifications = Array.isArray(notificationsData) ? notificationsData : [];

  const { data: stats, isLoading: statsLoading } = useNotificationStats();
  const createNotification = useCreateNotification();
  const sendNotification = useSendNotification();
  const deleteNotification = useDeleteNotification();

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNotification = async () => {
    if (!formData.title || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        targetAudience: formData.targetAudience,
      };

      await createNotification.mutateAsync(notificationData);
      setIsCreateModalOpen(false);
      resetForm();
      toast.success("Notification created successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to create notification';
      toast.error(errorMessage);
    }
  };

  const handleSendNotification = async (id: string) => {
    try {
      await sendNotification.mutateAsync(id);
      toast.success("Notification sent successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to send notification';
      toast.error(errorMessage);
    }
  };

  const handleDeleteClick = (notification: Notification) => {
    setNotificationToDelete(notification);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteNotification = async () => {
    if (!notificationToDelete) return;

    try {
      await deleteNotification.mutateAsync(notificationToDelete.id);
      setIsDeleteModalOpen(false);
      setNotificationToDelete(null);
      toast.success("Notification deleted successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to delete notification';
      toast.error(errorMessage);
    }
  };

  const handlePreview = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsPreviewModalOpen(true);
  };

  const handleViewStats = (notification: Notification) => {
    setSelectedNotification(notification);
    setIsStatsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "info",
      targetAudience: "all",
      scheduledAt: ""
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedType('');
    setSelectedAudience('');
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'success';
      case 'scheduled':
        return 'info';
      case 'failed':
        return 'error';
      case 'draft':
        return 'light';
      default:
        return 'light';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'info';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'primary';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (notificationsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading notifications...</div>
      </div>
    );
  }

  if (notificationsError) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <h3 className="text-red-800 dark:text-red-400 font-semibold">Error Loading Notifications</h3>
        <p className="text-red-600 dark:text-red-500">{notificationsError.message || 'Failed to load notifications'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Push Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and send push notifications to your users</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            startIcon={<Target className="w-4 h-4" />}
            onClick={() => setIsPreviewModalOpen(true)}
          >
            Preview
          </Button>
          <Button
            startIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-brand-500 text-white hover:bg-brand-600"
          >
            Create Notification
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <Bell className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.totalNotifications || notifications.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Notifications</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success-100 dark:bg-success-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.sentToday || notifications.filter(n => n.status === "sent").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sent Today</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning-100 dark:bg-warning-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.scheduled || notifications.filter(n => n.status === "scheduled").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <Users className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {statsLoading ? '...' : stats?.totalRecipients?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Search & Filter</h2>
          {(searchTerm || selectedStatus || selectedType || selectedAudience) && (
            <button
              onClick={clearFilters}
              className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-11 pl-10 pr-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-medium shadow-theme-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400 hover:border-gray-400 dark:hover:border-gray-500"
              />
            </div>
          </div>
          <div>
            <CustomSelect
              label="Status"
              labelIcon={<Filter className="w-4 h-4" />}
              options={[
                { value: "", label: "All Status" },
                { value: "draft", label: "Draft" },
                { value: "scheduled", label: "Scheduled" },
                { value: "sent", label: "Sent" },
                { value: "failed", label: "Failed" },
              ]}
              value={selectedStatus}
              placeholder="All Status"
              onChange={(value) => setSelectedStatus(value)}
            />
          </div>
          <div>
            <CustomSelect
              label="Type"
              labelIcon={<AlertCircle className="w-4 h-4" />}
              options={[
                { value: "", label: "All Types" },
                { value: "info", label: "Info", icon: <Info className="w-4 h-4" /> },
                { value: "warning", label: "Warning", icon: <AlertTriangle className="w-4 h-4" /> },
                { value: "success", label: "Success", icon: <CheckCircle2 className="w-4 h-4" /> },
                { value: "error", label: "Error", icon: <XCircle className="w-4 h-4" /> },
              ]}
              value={selectedType}
              placeholder="All Types"
              onChange={(value) => setSelectedType(value)}
            />
          </div>
          <div>
            <CustomSelect
              label="Target Audience"
              labelIcon={<Users className="w-4 h-4" />}
              options={[
                { value: "", label: "All Audiences" },
                { value: "all", label: "All Users", icon: <Users className="w-4 h-4" /> },
                { value: "premium", label: "Premium", icon: <CheckCircle className="w-4 h-4" /> },
                { value: "trial", label: "Trial", icon: <Clock className="w-4 h-4" /> },
                { value: "active", label: "Active", icon: <Target className="w-4 h-4" /> },
              ]}
              value={selectedAudience}
              placeholder="All Audiences"
              onChange={(value) => setSelectedAudience(value)}
            />
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notifications ({notifications.length})
          </h2>
        </div>
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Notification</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Type</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Target</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Delivery Stats</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No notifications found. Create your first notification to get started!
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <TableCell className="px-6 py-5">
                    <div className="max-w-sm">
                      <div className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                        {notification.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {notification.message}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatDate(notification.createdAt)} • {notification.createdBy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge color={getTypeBadgeColor(notification.type)}>
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {notification.targetAudience.charAt(0).toUpperCase() + notification.targetAudience.slice(1)} Users
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Badge color={getStatusBadgeColor(notification.status)}>
                      {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="text-sm">
                      {notification.deliveryStats ? (
                        <>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {notification.deliveryStats.sent.toLocaleString()} sent
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {notification.deliveryStats.opened.toLocaleString()} opened
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">No stats available</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <Tooltip content="Preview Notification" position="top">
                        <button
                          onClick={() => handlePreview(notification)}
                          className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Tooltip>
                      
                      {(notification.status === "scheduled" || notification.status === "draft") && (
                        <Tooltip content="Send Now" position="top">
                          <button
                            onClick={() => handleSendNotification(notification.id)}
                            disabled={sendNotification.isPending}
                            className="p-2 text-success-600 dark:text-success-400 hover:bg-success-100 dark:hover:bg-success-900/20 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      )}
                      
                      {notification.deliveryStats && notification.deliveryStats.sent > 0 && (
                        <Tooltip content="View Stats" position="top">
                          <button
                            onClick={() => handleViewStats(notification)}
                            className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                          >
                            <Target className="w-4 h-4" />
                          </button>
                        </Tooltip>
                      )}
                      
                      <Tooltip content="Delete Notification" position="top">
                        <button
                          onClick={() => handleDeleteClick(notification)}
                          disabled={deleteNotification.isPending}
                          className="p-2 text-error-600 dark:text-error-400 hover:bg-error-100 dark:hover:bg-error-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Notification Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        className="w-[90%] max-w-2xl mx-auto"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Create Push Notification
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Fill in the details to create a new push notification
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Title <span className="text-brand-600 dark:text-brand-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., New Security Update Available"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Message <span className="text-brand-600 dark:text-brand-400">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your notification message..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomSelect
                  label="Type"
                  labelIcon={<AlertCircle className="w-4 h-4" />}
                  options={[
                    { value: "info", label: "Info", icon: <Info className="w-4 h-4" /> },
                    { value: "warning", label: "Warning", icon: <AlertTriangle className="w-4 h-4" /> },
                    { value: "success", label: "Success", icon: <CheckCircle2 className="w-4 h-4" /> },
                    { value: "error", label: "Error", icon: <XCircle className="w-4 h-4" /> },
                  ]}
                  value={formData.type}
                  placeholder="Select type"
                  onChange={(value) => setFormData({ ...formData, type: value as any })}
                />
              </div>
              <div>
                <CustomSelect
                  label="Target Audience"
                  labelIcon={<Users className="w-4 h-4" />}
                  options={[
                    { value: "all", label: "All Users", icon: <Users className="w-4 h-4" /> },
                    { value: "premium", label: "Premium Users", icon: <CheckCircle className="w-4 h-4" /> },
                    { value: "trial", label: "Trial Users", icon: <Clock className="w-4 h-4" /> },
                    { value: "active", label: "Active Users", icon: <Target className="w-4 h-4" /> },
                  ]}
                  value={formData.targetAudience}
                  placeholder="Select audience"
                  onChange={(value) => setFormData({ ...formData, targetAudience: value as any })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                disabled={createNotification.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateNotification}
                disabled={createNotification.isPending}
                className="bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createNotification.isPending ? 'Creating...' : 'Create Notification'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        className="max-w-md mx-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Notification Preview
          </h2>
          {selectedNotification ? (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How it will appear to users:
                </h3>
                <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
                      <Bell className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {selectedNotification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {selectedNotification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge color={getTypeBadgeColor(selectedNotification.type)}>
                          {selectedNotification.type}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {selectedNotification.targetAudience} users
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>Select a notification to preview</p>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsPreviewModalOpen(false)} className="bg-brand-500 text-white hover:bg-brand-600">
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stats Modal */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        className="max-w-2xl mx-auto"
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Delivery Statistics
          </h2>
          {selectedNotification && selectedNotification.deliveryStats ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {selectedNotification.deliveryStats.sent.toLocaleString()}
                  </div>
                  <div className="text-sm text-brand-600 dark:text-brand-400">Sent</div>
                </div>
                <div className="bg-success-50 dark:bg-success-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                    {selectedNotification.deliveryStats.delivered.toLocaleString()}
                  </div>
                  <div className="text-sm text-success-600 dark:text-success-400">Delivered</div>
                </div>
                <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
                    {selectedNotification.deliveryStats.opened.toLocaleString()}
                  </div>
                  <div className="text-sm text-warning-600 dark:text-warning-400">Opened</div>
                </div>
                <div className="bg-brand-50 dark:bg-brand-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                    {selectedNotification.deliveryStats.clicked.toLocaleString()}
                  </div>
                  <div className="text-sm text-brand-600 dark:text-brand-400">Clicked</div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Performance Metrics</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Delivery Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedNotification.deliveryStats.sent > 0 
                        ? ((selectedNotification.deliveryStats.delivered / selectedNotification.deliveryStats.sent) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Open Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedNotification.deliveryStats.delivered > 0 
                        ? ((selectedNotification.deliveryStats.opened / selectedNotification.deliveryStats.delivered) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Click Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {selectedNotification.deliveryStats.opened > 0 
                        ? ((selectedNotification.deliveryStats.clicked / selectedNotification.deliveryStats.opened) * 100).toFixed(1)
                        : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Target className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p>No statistics available for this notification</p>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsStatsModalOpen(false)} className="bg-brand-500 text-white hover:bg-brand-600">
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Notification Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setNotificationToDelete(null);
        }}
        className="max-w-md mx-auto"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-error-100 dark:bg-error-900/20 rounded-lg">
              <Trash2 className="w-5 h-5 text-error-600 dark:text-error-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Delete Notification
            </h2>
          </div>
          
          {notificationToDelete && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete this notification? This action cannot be undone.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-4">
                <div className="font-semibold text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Notification Title:
                </div>
                <div className="font-bold text-base text-gray-900 dark:text-white">
                  {notificationToDelete.title}
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {notificationToDelete.message}
                </div>
              </div>
              <div className="bg-error-50 dark:bg-error-900/10 border border-error-200 dark:border-error-900/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-sm text-error-900 dark:text-error-300 mb-1">
                      Warning: This action is permanent
                    </div>
                    <div className="text-xs text-error-700 dark:text-error-400">
                      All data associated with this notification will be permanently deleted and cannot be recovered.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setNotificationToDelete(null);
              }}
              disabled={deleteNotification.isPending}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteNotification}
              disabled={deleteNotification.isPending}
              className="bg-error-600 text-white hover:bg-error-700 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] px-6"
            >
              {deleteNotification.isPending ? "Deleting..." : "Delete Notification"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
