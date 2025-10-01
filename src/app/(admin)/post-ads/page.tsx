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
  Edit
} from "lucide-react";
import Tooltip from "@/components/ui/tooltip/Tooltip";
import { toast } from "react-hot-toast";

// Ad interface
interface PostAd {
  id: string;
  title: string;
  content: string;
  link?: string;
  isActive: boolean;
  priority: "high" | "medium" | "low";
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  clicks: number;
  impressions: number;
}

// Mock data for post ads
const mockAds: PostAd[] = [
  {
    id: "1",
    title: "50% OFF - Professional Security Scanner",
    content: "Limited time offer! Get 50% discount on our Professional Security Scanner plan. Secure your website today!",
    link: "https://cyberix.com/purchase?discount=50off",
    isActive: true,
    priority: "high",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    clicks: 1247,
    impressions: 15680
  },
  {
    id: "2",
    title: "30% OFF - Enterprise Security Suite",
    content: "Special discount! Save 30% on our Enterprise Security Suite. Perfect for large organizations!",
    link: "https://cyberix.com/purchase?discount=30off",
    isActive: false,
    priority: "medium",
    startDate: "2024-01-20",
    endDate: "2024-03-20",
    createdAt: "2024-01-18",
    updatedAt: "2024-01-19",
    clicks: 892,
    impressions: 12340
  },
  {
    id: "3",
    title: "Buy 2 Get 1 FREE - Basic Plans",
    content: "Amazing deal! Purchase 2 Basic Security Scanner licenses and get 1 absolutely free!",
    link: "https://cyberix.com/purchase?deal=buy2get1",
    isActive: false,
    priority: "low",
    startDate: "2024-01-25",
    endDate: "2024-02-25",
    createdAt: "2024-01-22",
    updatedAt: "2024-01-23",
    clicks: 456,
    impressions: 7890
  }
];

export default function PostAds() {
  const [ads, setAds] = useState<PostAd[]>(mockAds);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<PostAd | null>(null);
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

  const handleCreateAd = () => {
    if (!formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newAd: PostAd = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      link: formData.link,
      isActive: true,
      priority: formData.priority,
      startDate: formData.startDate,
      endDate: formData.endDate,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      clicks: 0,
      impressions: 0
    };

    setAds([...ads, newAd]);
    setIsCreateModalOpen(false);
    resetForm();
    toast.success("Ad created successfully!");
  };

  const handleEditAd = (ad: PostAd) => {
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

  const handleUpdateAd = () => {
    if (!editingAd || !formData.title || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setAds(ads.map(ad => 
      ad.id === editingAd.id 
        ? { 
            ...ad, 
            title: formData.title,
            content: formData.content,
            link: formData.link,
            priority: formData.priority,
            startDate: formData.startDate,
            endDate: formData.endDate,
            updatedAt: new Date().toISOString().split('T')[0]
          }
        : ad
    ));
    setIsEditModalOpen(false);
    setEditingAd(null);
    resetForm();
    toast.success("Ad updated successfully!");
  };

  const handleDeleteAd = (id: string) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      setAds(ads.filter(ad => ad.id !== id));
      toast.success("Ad deleted successfully!");
    }
  };

  const handleToggleActive = (id: string) => {
    setAds(ads.map(ad => {
      if (ad.id === id) {
        // If activating this ad, deactivate all others
        if (!ad.isActive) {
          return { ...ad, isActive: true };
        } else {
          return { ...ad, isActive: false };
        }
      } else {
        // Deactivate all other ads when activating one
        return { ...ad, isActive: false };
      }
    }));
    const ad = ads.find(a => a.id === id);
    toast.success(ad?.isActive ? "Ad deactivated!" : "Ad activated! Only one ad can be active at a time.");
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
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{ads.length}</div>
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
                {ads.filter(ad => ad.isActive).length}
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
                {ads.reduce((sum, ad) => sum + ad.clicks, 0)}
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
                {ads.reduce((sum, ad) => sum + ad.impressions, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ads Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50 dark:bg-gray-800">
            <TableRow>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Title</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Status</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Priority</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Duration</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Performance</TableCell>
              <TableCell isHeader className="px-6 py-4 font-semibold text-gray-900 dark:text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200 dark:divide-gray-700">
            {ads.map((ad) => (
              <TableRow key={ad.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <TableCell className="px-6 py-5">
                  <div className="max-w-sm">
                    <div className="font-semibold text-gray-900 dark:text-white text-base mb-1">
                      {ad.title}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {ad.content}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge 
                    color={ad.isActive ? "success" : "light"}
                  >
                    {ad.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Badge 
                    color={ad.priority === "high" ? "error" : ad.priority === "medium" ? "warning" : "success"}
                  >
                    {ad.priority.charAt(0).toUpperCase() + ad.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{ad.startDate}</div>
                    <div className="text-gray-500 dark:text-gray-400">to {ad.endDate}</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900 dark:text-white">{ad.clicks.toLocaleString()} clicks</div>
                    <div className="text-gray-500 dark:text-gray-400">{ad.impressions.toLocaleString()} views</div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <Tooltip content={ad.isActive ? "Pause Ad" : "Activate Ad"} position="top">
                      <button
                        onClick={() => handleToggleActive(ad.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          ad.isActive 
                            ? 'text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-900/20' 
                            : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {ad.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Edit Ad" position="top">
                      <button
                        onClick={() => handleEditAd(ad)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </Tooltip>
                    
                    <Tooltip content="Delete Ad" position="top">
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
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

      {/* Create Ad Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Create New Ad
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
              placeholder="e.g., 50% OFF - Professional Security Scanner"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="e.g., Limited time offer! Get 50% discount on our Professional Security Scanner plan. Secure your website today!"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
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
            <Button onClick={handleCreateAd}>
              Create Ad
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
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Edit Ad
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
              placeholder="e.g., 50% OFF - Professional Security Scanner"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="e.g., Limited time offer! Get 50% discount on our Professional Security Scanner plan. Secure your website today!"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link (Optional)
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleInputChange}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingAd(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateAd}>
              Update Ad
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
            Preview Marquee Ads
          </h2>
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Website Header Preview
            </h3>
            <div className="bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Simulated website header */}
              <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Cyberix Security Scanner
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    Admin Dashboard
                  </div>
                </div>
              </div>
              
              {/* Marquee ads simulation */}
              <div className="bg-brand-500 text-white py-2 overflow-hidden">
                <div className="flex animate-pulse">
                  {ads.filter(ad => ad.isActive).length > 0 ? (
                    ads.filter(ad => ad.isActive).map((ad) => (
                      <div key={ad.id} className="flex items-center gap-4 whitespace-nowrap mr-8">
                        <span className="font-medium">{ad.title}</span>
                        <span className="text-brand-100">{ad.content}</span>
                        {ad.link && (
                          <button className="bg-white/20 px-2 py-1 rounded text-xs hover:bg-white/30 transition-colors">
                            Learn More
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-brand-100 text-center w-full">
                      No active ads to display
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Active Ads ({ads.filter(ad => ad.isActive).length})
            </h3>
            {ads.filter(ad => ad.isActive).length > 0 ? (
              <div className="space-y-3">
                {ads.filter(ad => ad.isActive).map(ad => (
                  <div key={ad.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{ad.title}</h4>
                          <Badge 
                            color={ad.priority === "high" ? "error" : ad.priority === "medium" ? "warning" : "success"}
                          >
                            {ad.priority.charAt(0).toUpperCase() + ad.priority.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ad.content}</p>
                        {ad.link && (
                          <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                            <ExternalLink className="w-4 h-4" />
                            <a href={ad.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {ad.link}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div>{ad.startDate} - {ad.endDate}</div>
                        <div>{ad.clicks} clicks • {ad.impressions} views</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No active ads to display</p>
                <p className="text-sm">Create and activate ads to see them in the marquee</p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setIsPreviewModalOpen(false)}>
              Close Preview
            </Button>
          </div>
        </div>
        </div>
      </Modal>
    </div>
  );
}
