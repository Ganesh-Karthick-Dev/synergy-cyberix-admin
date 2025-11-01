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
  Play, 
  Pause, 
  Megaphone,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Edit,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import { toast } from "react-hot-toast";
import { useAds, useAdStats, useCreateAd, useUpdateAd, useToggleAd, useDeleteAd } from "@/hooks/api/useAds";
import { Ad } from "@/lib/api/services";
import DatePicker from "@/components/form/date-picker";

export default function PostAds() {
  // React Query hooks
  const { data: adsData, isLoading: adsLoading, error: adsError, refetch } = useAds();
  const { data: statsData } = useAdStats();
  const createAd = useCreateAd();
  const updateAd = useUpdateAd();
  const toggleAd = useToggleAd();
  const deleteAd = useDeleteAd();

  const ads = adsData || [];
  const stats = statsData || {
    totalAds: 0,
    activeAds: 0,
    totalClicks: 0,
    totalImpressions: 0,
    clickThroughRate: 0,
    topPerformingAd: 'N/A',
  };
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    link: "",
    priority: "medium" as "high" | "medium" | "low",
    startDate: "",
    endDate: ""
  });

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateAd = async () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      await createAd.mutateAsync({
        title: formData.title,
        content: formData.content,
        link: formData.link || undefined,
        priority: formData.priority,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: false, // New ads start inactive
      });
      
      setIsCreateModalOpen(false);
      resetForm();
      toast.success("Ad created successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || "Failed to create ad";
      toast.error(errorMessage);
    }
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      content: ad.content,
      link: ad.link || "",
      priority: ad.priority,
      startDate: ad.startDate,
      endDate: ad.endDate
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateAd = async () => {
    if (!editingAd || !formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    try {
      await updateAd.mutateAsync({
        id: editingAd.id,
        data: {
          title: formData.title,
          content: formData.content,
          link: formData.link || undefined,
          priority: formData.priority,
          startDate: formData.startDate,
          endDate: formData.endDate,
        },
      });
      
      setIsEditModalOpen(false);
      setEditingAd(null);
      resetForm();
      toast.success("Ad updated successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || "Failed to update ad";
      toast.error(errorMessage);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) {
      return;
    }

    try {
      await deleteAd.mutateAsync(id);
      toast.success("Ad deleted successfully!");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || "Failed to delete ad";
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await toggleAd.mutateAsync(id);
      const ad = ads.find(a => a.id === id);
      toast.success(ad?.isActive ? "Ad deactivated!" : "Ad activated! Only one ad can be active at a time.");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || "Failed to toggle ad status";
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      link: "",
      priority: "medium",
      startDate: "",
      endDate: ""
    });
  };

  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  const toggleRowExpansion = (adId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(adId)) {
        newSet.delete(adId);
      } else {
        newSet.add(adId);
      }
      return newSet;
    });
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Post Ads Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage marquee ads that appear in the website header</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            startIcon={<Eye className="w-4 h-4" />}
            onClick={handlePreview}
          >
            Preview Ads
          </Button>
          <Button
            startIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create New Ad
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Megaphone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAds}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Ads</div>
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
                {stats.activeAds}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Active Ads</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <ExternalLink className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalClicks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Eye className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalImpressions.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ads Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        {adsLoading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p>Loading ads...</p>
          </div>
        ) : adsError ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-red-600 dark:text-red-400 mb-4 text-lg font-medium">
              Error loading ads. Please try again.
            </p>
            <Button onClick={() => refetch()} variant="outline" className="mt-2">
              Retry
            </Button>
          </div>
        ) : ads.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <Megaphone className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-lg font-medium mb-2">No ads found</p>
            <p className="text-sm">Create your first ad to get started.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <TableRow>
                <TableCell isHeader className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm uppercase text-start tracking-wider">
                  Title
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider text-start">
                  Status
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider text-start">
                  Priority
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm uppercase text-start tracking-wider">
                  Duration
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm uppercase text-start tracking-wider">
                  Performance
                </TableCell>
                <TableCell isHeader className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm uppercase text-start tracking-wider text-start">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
              {ads.map((ad) => {
                const isExpanded = expandedRows.has(ad.id);
                return (
                  <React.Fragment key={ad.id}>
                    <TableRow 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-all border-b border-gray-100 dark:border-gray-800 cursor-pointer"
                      {...({ onClick: () => toggleRowExpansion(ad.id) } as any)}
                    >
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="font-bold text-gray-900 dark:text-white text-base">
                          {ad.title}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="flex justify-start">
                          <Badge 
                            color={ad.isActive ? "success" : "light"}
                            size="md"
                          >
                            {ad.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="flex justify-start">
                          <Badge 
                            color={ad.priority === "high" ? "error" : ad.priority === "medium" ? "warning" : "success"}
                            size="md"
                          >
                            {ad.priority.charAt(0).toUpperCase() + ad.priority.slice(1)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="space-y-1 text-start">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">
                            {ad.startDate}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            to {ad.endDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle">
                        <div className="space-y-1">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">
                            {ad.clicks.toLocaleString()} <span className="text-xs font-normal text-gray-500 dark:text-gray-400">clicks</span>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {ad.impressions.toLocaleString()} <span className="text-xs">views</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 align-middle" {...({ onClick: (e: React.MouseEvent) => e.stopPropagation() } as any)}>
                        <div className="flex items-center justify-start gap-2">
                          <Tooltip content={ad.isActive ? "Pause Ad" : "Activate Ad"} position="top">
                            <button
                              onClick={() => handleToggleActive(ad.id)}
                              className={`p-2.5 rounded-lg transition-all hover:scale-105 active:scale-95 ${
                                ad.isActive 
                                  ? 'text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:text-brand-400 dark:hover:bg-brand-900/30' 
                                  : 'text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30'
                              }`}
                            >
                              {ad.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                          </Tooltip>
                          
                          <Tooltip content="Edit Ad" position="top">
                            <button
                              onClick={() => handleEditAd(ad)}
                              className="p-2.5 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 rounded-lg transition-all hover:scale-105 active:scale-95"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          
                          <Tooltip content="Delete Ad" position="top">
                            <button
                              onClick={() => handleDeleteAd(ad.id)}
                              className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-all hover:scale-105 active:scale-95"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRowExpansion(ad.id);
                            }}
                            className="p-2.5 text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-all hover:scale-105 active:scale-95 ml-2"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow className="bg-gray-50/50 dark:bg-gray-800/30 border-b border-gray-200 dark:border-gray-700">
                        <TableCell {...({ colSpan: 6 } as any)} className="px-6 py-6">
                          <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                            {/* Content Section */}
                            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                                Ad Content
                              </h4>
                              <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {ad.content}
                              </p>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* Link Section */}
                              {ad.link && (
                                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                    Link
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                    <a 
                                      href={ad.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline truncate font-medium"
                                    >
                                      {ad.link}
                                    </a>
                                  </div>
                                </div>
                              )}

                              {/* Date Range Section */}
                              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                  Date Range
                                </h4>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      Start: {ad.startDate}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                      End: {ad.endDate}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Performance Metrics Section */}
                              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
                                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                  Performance Metrics
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Clicks</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                      {ad.clicks.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Impressions</span>
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                      {ad.impressions.toLocaleString()}
                                    </span>
                                  </div>
                                  {ad.impressions > 0 && (
                                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Click-Through Rate</span>
                                        <span className="text-lg font-bold text-brand-600 dark:text-brand-400">
                                          {((ad.clicks / ad.impressions) * 100).toFixed(2)}%
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Timestamps */}
                            <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Created:</span>
                                <span>{ad.createdAt}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Updated:</span>
                                <span>{ad.updatedAt}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
        </Table>
        )}
      </div>

      {/* Create Ad Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        className="w-[80%] max-w-4xl mx-auto max-h-[90vh] flex flex-col"
      >
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Ad
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fill in the details to create a new marquee ad for your website header
            </p>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-brand-600 dark:text-brand-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 50% OFF - Professional Security Scanner"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                  required
                />
              </div>

              {/* Grid Layout for Priority and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start Date <span className="text-brand-600 dark:text-brand-400">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="start-date-picker"
                      placeholder="Select start date"
                      defaultDate={formData.startDate ? formData.startDate : undefined}
                      onChange={(selectedDates, dateStr) => {
                        if (dateStr) {
                          setFormData(prev => ({ ...prev, startDate: dateStr }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    End Date <span className="text-brand-600 dark:text-brand-400">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="end-date-picker"
                      placeholder="Select end date"
                      defaultDate={formData.endDate ? formData.endDate : undefined}
                      onChange={(selectedDates, dateStr) => {
                        if (dateStr) {
                          setFormData(prev => ({ ...prev, endDate: dateStr }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Content <span className="text-brand-600 dark:text-brand-400">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="e.g., Limited time offer! Get 50% discount on our Professional Security Scanner plan. Secure your website today!"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
                  required
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>

              
            </div>
          </div>
          
          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                disabled={createAd.isPending}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAd}
                disabled={createAd.isPending}
                className="bg-brand-500 text-white hover:bg-brand-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createAd.isPending ? "Creating Ad..." : "Create Ad"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Ad Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAd(null);
          resetForm();
        }}
        className="w-[80%] max-w-4xl mx-auto max-h-[90vh] flex flex-col"
      >
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Edit Ad
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Update ad details and settings below
            </p>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-brand-600 dark:text-brand-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., 50% OFF - Professional Security Scanner"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Content <span className="text-brand-600 dark:text-brand-400">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="e.g., Limited time offer! Get 50% discount on our Professional Security Scanner plan. Secure your website today!"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
                  required
                />
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Link (Optional)
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                />
              </div>

              {/* Grid Layout for Priority and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Start Date <span className="text-brand-600 dark:text-brand-400">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="edit-start-date-picker"
                      placeholder="Select start date"
                      defaultDate={formData.startDate ? formData.startDate : undefined}
                      onChange={(selectedDates, dateStr) => {
                        if (dateStr) {
                          setFormData(prev => ({ ...prev, startDate: dateStr }));
                        }
                      }}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    End Date <span className="text-brand-600 dark:text-brand-400">*</span>
                  </label>
                  <div className="relative">
                    <DatePicker
                      id="edit-end-date-picker"
                      placeholder="Select end date"
                      defaultDate={formData.endDate ? formData.endDate : undefined}
                      onChange={(selectedDates, dateStr) => {
                        if (dateStr) {
                          setFormData(prev => ({ ...prev, endDate: dateStr }));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAd(null);
                  resetForm();
                }}
                disabled={updateAd.isPending}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateAd}
                disabled={updateAd.isPending}
                className="bg-brand-500 text-white hover:bg-brand-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateAd.isPending ? "Updating Ad..." : "Update Ad"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        className="w-full max-w-[95vw] mx-auto max-h-[90vh] flex flex-col"
      >
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Preview Marquee Ads
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              How your ads will appear on the website header
            </p>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-8">
              {/* Website Header Preview */}
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Website Header Preview
                </h3>
                <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
                  {/* Simulated website header */}
                  <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-semibold text-gray-700 dark:text-gray-300">
                        Cyberix Security Scanner
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Admin Dashboard
                      </div>
                    </div>
                  </div>
                  
                  {/* Marquee ads simulation */}
                  <div className="bg-gradient-to-r from-brand-500 to-brand-600 text-white py-3 overflow-hidden relative">
                    {ads.filter(ad => ad.isActive).length > 0 ? (
                      <div className="flex animate-marquee whitespace-nowrap">
                        {ads.filter(ad => ad.isActive).map((ad) => (
                          <div key={ad.id} className="flex items-center gap-4 mr-12 inline-flex">
                            <span className="font-semibold text-base">{ad.title}</span>
                            <span className="text-brand-100 text-sm">{ad.content}</span>
                            {ad.link && (
                              <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm">
                                Learn More →
                              </button>
                            )}
                          </div>
                        ))}
                        {/* Duplicate for seamless loop */}
                        {ads.filter(ad => ad.isActive).map((ad) => (
                          <div key={`duplicate-${ad.id}`} className="flex items-center gap-4 mr-12 inline-flex">
                            <span className="font-semibold text-base">{ad.title}</span>
                            <span className="text-brand-100 text-sm">{ad.content}</span>
                            {ad.link && (
                              <button className="bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors backdrop-blur-sm">
                                Learn More →
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-brand-100 text-center w-full py-2 text-sm">
                        No active ads to display
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Ads List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Active Ads
                  </h3>
                  <Badge color="success">
                    {ads.filter(ad => ad.isActive).length} Active
                  </Badge>
                </div>
                
                {ads.filter(ad => ad.isActive).length > 0 ? (
                  <div className="space-y-4">
                    {ads.filter(ad => ad.isActive).map(ad => (
                      <div key={ad.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {ad.title}
                              </h4>
                              <Badge 
                                color={ad.priority === "high" ? "error" : ad.priority === "medium" ? "warning" : "success"}
                              >
                                {ad.priority.charAt(0).toUpperCase() + ad.priority.slice(1)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                              {ad.content}
                            </p>
                            {ad.link && (
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-200 dark:border-blue-800">
                                  <ExternalLink className="w-4 h-4" />
                                  <a 
                                    href={ad.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="hover:underline font-medium"
                                  >
                                    {ad.link}
                                  </a>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="text-right min-w-[180px]">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                                Date Range
                              </div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                                {ad.startDate} - {ad.endDate}
                              </div>
                              <div className="space-y-1.5 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500 dark:text-gray-400">Clicks</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {ad.clicks.toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-gray-500 dark:text-gray-400">Views</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {ad.impressions.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 border-dashed">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                      No active ads to display
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Create and activate ads to see them in the marquee
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end">
              <Button 
                onClick={() => setIsPreviewModalOpen(false)}
                className="bg-brand-500 text-white hover:bg-brand-600 px-6"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
