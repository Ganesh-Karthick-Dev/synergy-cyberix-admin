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
  Target
} from "lucide-react";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import { toast } from "react-hot-toast";

// Notification interface
interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error" | "promotion";
  targetAudience: "all" | "active" | "trial" | "premium";
  scheduledAt?: string;
  sentAt?: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  deliveryStats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
  createdAt: string;
  createdBy: string;
}

// Mock data for push notifications
const mockNotifications: PushNotification[] = [
  {
    id: "1",
    title: "New Security Update Available",
    message: "We've released a new security scanner update with enhanced vulnerability detection. Update now to stay protected!",
    type: "info",
    targetAudience: "all",
    sentAt: "2024-01-15 10:30:00",
    status: "sent",
    deliveryStats: {
      sent: 2847,
      delivered: 2756,
      opened: 1923,
      clicked: 456
    },
    createdAt: "2024-01-15 10:00:00",
    createdBy: "Admin"
  },
  {
    id: "2",
    title: "50% OFF - Premium Security Suite",
    message: "Limited time offer! Get 50% discount on our Premium Security Suite. Secure your business today!",
    type: "promotion",
    targetAudience: "trial",
    scheduledAt: "2024-01-20 14:00:00",
    status: "scheduled",
    deliveryStats: {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    },
    createdAt: "2024-01-18 09:00:00",
    createdBy: "Admin"
  },
  {
    id: "3",
    title: "Security Alert - Critical Vulnerability",
    message: "We've detected a critical security vulnerability in your system. Please run a security scan immediately.",
    type: "error",
    targetAudience: "active",
    sentAt: "2024-01-12 15:45:00",
    status: "sent",
    deliveryStats: {
      sent: 1923,
      delivered: 1890,
      opened: 1789,
      clicked: 1234
    },
    createdAt: "2024-01-12 15:30:00",
    createdBy: "Security Team"
  }
];

export default function PushNotifications() {
  const [notifications, setNotifications] = useState<PushNotification[]>(mockNotifications);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<PushNotification | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success" | "error" | "promotion",
    targetAudience: "all" as "all" | "active" | "trial" | "premium",
    scheduledAt: ""
  });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateNotification = () => {
    if (!formData.title || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newNotification: PushNotification = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      type: formData.type,
      targetAudience: formData.targetAudience,
      scheduledAt: formData.scheduledAt || undefined,
      status: formData.scheduledAt ? "scheduled" : "draft",
      deliveryStats: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0
      },
      createdAt: new Date().toISOString(),
      createdBy: "Admin"
    };

    setNotifications([...notifications, newNotification]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("Notification created successfully!");
  };

  const handleSendNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { 
            ...notification, 
            status: "sent", 
            sentAt: new Date().toISOString(),
            deliveryStats: {
              sent: getTargetUserCount(notification.targetAudience),
              delivered: 0,
              opened: 0,
              clicked: 0
            }
          }
        : notification
    ));
    toast.success("Notification sent successfully!");
  };

  const handleDeleteNotification = (id: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(notifications.filter(notification => notification.id !== id));
      toast.success("Notification deleted successfully!");
    }
  };

  const handlePreview = (notification: PushNotification) => {
    setSelectedNotification(notification);
    setIsPreviewModalOpen(true);
  };

  const handleViewStats = (notification: PushNotification) => {
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

  const getTargetUserCount = (audience: string) => {
    switch (audience) {
      case "all": return 2847;
      case "active": return 1923;
      case "trial": return 456;
      case "premium": return 468;
      default: return 0;
    }
  };


  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Push Notifications Management
        </h2>
      </div>

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        {/* Header Actions */}
        <div className="flex items-center justify-end gap-3">
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
          >
            Create Notification
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Notifications</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => n.status === "sent").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sent</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => n.status === "scheduled").length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Scheduled</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">2,847</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
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
            {notifications.map((notification) => (
              <TableRow key={notification.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <TableCell className="px-6 py-5">
                  <div className="max-w-sm">
                    <div className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                      {notification.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {notification.createdAt} • {notification.createdBy}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge 
                    color={notification.type === "info" ? "info" : notification.type === "warning" ? "warning" : notification.type === "success" ? "success" : notification.type === "error" ? "error" : "primary"}
                  >
                    {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {notification.targetAudience.charAt(0).toUpperCase() + notification.targetAudience.slice(1)} Users
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {getTargetUserCount(notification.targetAudience).toLocaleString()} recipients
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge 
                    color={notification.status === "sent" ? "success" : notification.status === "scheduled" ? "info" : "light"}
                  >
                    {notification.status.charAt(0).toUpperCase() + notification.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {notification.deliveryStats.sent.toLocaleString()} sent
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {notification.deliveryStats.opened.toLocaleString()} opened
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Tooltip content="Preview Notification" position="top">
                      <button
                        onClick={() => handlePreview(notification)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    
                    {notification.status === "draft" && (
                      <Tooltip content="Send Now" position="top">
                        <button
                          onClick={() => handleSendNotification(notification.id)}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    )}
                    
                    <Tooltip content="View Stats" position="top">
                      <button
                        onClick={() => handleViewStats(notification)}
                        className="p-2 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Delete Notification" position="top">
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
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
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Create Push Notification
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., New Security Update Available"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Enter your notification message..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="promotion">Promotion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Target Audience
                </label>
                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
                >
                  <option value="all">All Users (2,847)</option>
                  <option value="active">Active Users (1,923)</option>
                  <option value="trial">Trial Users (456)</option>
                  <option value="premium">Premium Users (468)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Schedule (Optional)
              </label>
              <input
                type="datetime-local"
                name="scheduledAt"
                value={formData.scheduledAt}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to send immediately
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateNotification}>
                Create Notification
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
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
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {selectedNotification.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {selectedNotification.message}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge>
                          {selectedNotification.type}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getTargetUserCount(selectedNotification.targetAudience)} recipients
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
            <Button onClick={() => setIsPreviewModalOpen(false)}>
              Close Preview
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stats Modal */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Delivery Statistics
          </h2>
          {selectedNotification ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedNotification.deliveryStats.sent.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Sent</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {selectedNotification.deliveryStats.delivered.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Delivered</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {selectedNotification.deliveryStats.opened.toLocaleString()}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Opened</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {selectedNotification.deliveryStats.clicked.toLocaleString()}
                  </div>
                  <div className="text-sm text-orange-600 dark:text-orange-400">Clicked</div>
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
              <p>Select a notification to view statistics</p>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button onClick={() => setIsStatsModalOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
}






