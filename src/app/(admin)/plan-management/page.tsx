"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ArrowRightIcon, PencilIcon, EyeIcon, PlusIcon } from "@/icons/index";
import { toast } from "react-hot-toast";
import {
  usePlans,
  useCreatePlan,
  useUpdatePlan,
  useTogglePlanStatus,
} from '@/hooks/api/useServicePlans';

// Plan interface
interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Form data interface
interface PlanFormData {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

// Initial form data
const initialFormData: PlanFormData = {
  name: "",
  price: 0,
  description: "",
  features: [],
  isPopular: false,
  isActive: true,
};

export default function PlanManagement() {
  // API Hooks
  const { data: plans = [], isLoading: plansLoading, error: plansError } = usePlans();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const togglePlanStatus = useTogglePlanStatus();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ plan: Plan | null; action: string }>({ plan: null, action: '' });
  const [confirmActionInput, setConfirmActionInput] = useState('');
  const [confirmPlanNameInput, setConfirmPlanNameInput] = useState('');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<PlanFormData>(initialFormData);
  const [newFeature, setNewFeature] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isModalOpen) {
      setFormData(initialFormData);
      setEditingPlan(null);
      setNewFeature("");
    }
  }, [isModalOpen]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.features.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const planData = {
      name: formData.name,
      price: formData.price,
      description: formData.description,
      features: formData.features,
      isPopular: formData.isPopular,
      isActive: formData.isActive,
    };

    try {
      if (editingPlan) {
        await updatePlan.mutateAsync({ id: editingPlan.id, data: planData });
        toast.success("Plan updated successfully!");
      } else {
        await createPlan.mutateAsync(planData);
        toast.success("Plan created successfully!");
      }
      setIsModalOpen(false);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || 'Failed to save plan';
      toast.error(errorMessage);
    }
  };

  // Handle edit
  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: plan.features,
      isPopular: plan.isPopular,
      isActive: plan.isActive,
    });
    setIsModalOpen(true);
  };

  // Handle toggle status
  const handleToggleStatus = (plan: Plan) => {
    setConfirmAction({
      plan,
      action: plan.isActive ? 'deactivate' : 'activate'
    });
    setConfirmActionInput('');
    setConfirmPlanNameInput('');
    setIsConfirmModalOpen(true);
  };

  // Get expected action text
  const getExpectedAction = () => {
    return confirmAction.action === 'deactivate' ? 'deactivate' : 'activate';
  };

  // Check if action input is correct
  const isActionInputValid = () => {
    const expected = getExpectedAction().toLowerCase().trim();
    const input = confirmActionInput.toLowerCase().trim();
    return expected === input;
  };

  // Check if plan name input is correct
  const isPlanNameInputValid = () => {
    if (!confirmAction.plan) return false;
    const expected = confirmAction.plan.name.toLowerCase().trim();
    const input = confirmPlanNameInput.toLowerCase().trim();
    return expected === input;
  };

  // Check if both confirmations are valid
  const isConfirmationValid = () => {
    return isActionInputValid() && isPlanNameInputValid();
  };

  // Confirm toggle status
  const confirmToggleStatus = async () => {
    if (!confirmAction.plan) return;

    // For deactivation, require both confirmation inputs
    if (confirmAction.action === 'deactivate') {
      if (!isActionInputValid()) {
        toast.error(`Please type "deactivate" in the action field`);
        return;
      }

      if (!isPlanNameInputValid()) {
        toast.error(`Please type the exact plan name "${confirmAction.plan.name}" in the plan name field`);
        return;
      }
    }

    try {
      await togglePlanStatus.mutateAsync(confirmAction.plan.id);
      toast.success(`Plan ${confirmAction.action}d successfully!`);
      setIsConfirmModalOpen(false);
      setConfirmAction({ plan: null, action: '' });
      setConfirmActionInput('');
      setConfirmPlanNameInput('');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.error?.message || error?.message || `Failed to ${confirmAction.action} plan`;
      toast.error(errorMessage);
    }
  };

  // Handle preview
  const handlePreview = () => {
    setIsPreviewModalOpen(true);
  };

  // Add feature
  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()]
      });
      setNewFeature("");
    }
  };

  // Remove feature
  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading service plans...</div>
      </div>
    );
  }

  if (plansError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold">Error Loading Plans</h3>
        <p className="text-red-600">{plansError.message || 'Failed to load plans'}</p>
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
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Security Service Plans</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your cybersecurity service packages and pricing</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handlePreview}
            variant="outline"
            startIcon={<EyeIcon />}
          >
            Preview All Plans
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            startIcon={<PlusIcon />}
          >
            Add New Plan
          </Button>
        </div>
      </div>

      {/* Plans Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800 relative" id="plans-table-container">
        <div className="overflow-x-auto relative">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-gray-800">
                <TableCell isHeader className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Plan Name
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Price
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Features
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Status
                </TableCell>
                <TableCell isHeader className="px-6 py-4 text-left text-sm font-medium text-gray-900 dark:text-white">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(!plans || plans.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No plans found. Create your first plan to get started!
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan) => (
                <TableRow 
                  key={plan.id} 
                  className={`border-b transition-all ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-brand-50 via-orange-50 to-brand-50 dark:from-brand-900/20 dark:via-orange-900/10 dark:to-brand-900/20 border-brand-200 dark:border-brand-800 hover:from-brand-100 hover:via-orange-100 hover:to-brand-100 dark:hover:from-brand-900/30 dark:hover:via-orange-900/20 dark:hover:to-brand-900/30 shadow-sm'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  {/* Popular Plan Badge - Positioned across entire row */}
                  <TableCell className="px-6 py-4 relative">
                    {plan.isPopular && (
                      <div 
                        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                        style={{
                          width: 'max(1000px, calc(100vw - 4rem))',
                          marginLeft: 0,
                        }}
                      >
                        <div className="flex justify-center w-full">
                          <div className="flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-orange-500 text-white px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-xs font-bold tracking-wide">MOST POPULAR</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className={`font-bold text-lg flex items-center gap-2 ${
                          plan.isPopular 
                            ? 'text-brand-700 dark:text-brand-300' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {plan.name}
                          {plan.isPopular && (
                            <svg className="w-5 h-5 text-brand-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                        <div className={`text-sm mt-1 ${
                          plan.isPopular 
                            ? 'text-brand-600 dark:text-brand-400' 
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {plan.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className={`text-2xl font-bold ${
                      plan.isPopular 
                        ? 'text-brand-600 dark:text-brand-400' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      ${plan.price}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className={`text-sm font-medium ${
                      plan.isPopular 
                        ? 'text-brand-700 dark:text-brand-300' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {plan.features.length} features
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      plan.isActive 
                        ? plan.isPopular
                          ? 'bg-white text-brand-600 border-2 border-brand-300 shadow-sm'
                          : 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(plan)}
                        startIcon={<PencilIcon />}
                        className={plan.isPopular 
                          ? "bg-white border-brand-300 text-brand-600 hover:bg-brand-50 hover:border-brand-400 dark:bg-brand-900/20 dark:border-brand-700 dark:text-brand-400 dark:hover:bg-brand-900/30"
                          : "hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-900/20"
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant={plan.isActive ? "outline" : "default"}
                        onClick={() => handleToggleStatus(plan)}
                        disabled={togglePlanStatus.isPending}
                        className={
                          plan.isActive
                            ? plan.isPopular
                              ? "border-brand-500 bg-white text-brand-600 hover:bg-brand-50 hover:border-brand-600"
                              : "border-brand-500 text-brand-600 hover:bg-brand-50 hover:border-brand-600 dark:hover:bg-brand-900/20"
                            : "bg-brand-500 text-white hover:bg-brand-600"
                        }
                      >
                        {togglePlanStatus.isPending ? 'Processing...' : plan.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="w-[80%] max-w-4xl mx-auto max-h-[90vh] flex flex-col">
        <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
          {/* Fixed Header */}
          <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {editingPlan ? 'Edit Service Plan' : 'Create New Service Plan'}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {editingPlan ? 'Update plan details and features below' : 'Fill in the details to create a new service plan'}
            </p>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form id="plan-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Grid Layout for Name and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Plan Name <span className="text-brand-600 dark:text-brand-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                  placeholder="e.g., Basic Security Scan"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Price (USD) <span className="text-brand-600 dark:text-brand-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                    placeholder="299"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-brand-600 dark:text-brand-400">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
                placeholder="Describe the security services included in this plan..."
                rows={4}
                required
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Features <span className="text-brand-600 dark:text-brand-400">*</span>
              </label>
              <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                {formData.features.length > 0 ? (
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {feature}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                    No features added yet. Add your first feature below.
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white transition-all"
                    placeholder="Enter a new feature..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button
                    onClick={addFeature}
                    disabled={!newFeature.trim()}
                    className="bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Feature
                  </Button>
                </div>
              </div>
            </div>

            {/* Plan Status Options */}
            <div className="max-w-md">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Plan Options
              </label>
              <div className="space-y-3 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <label className="flex items-center justify-between cursor-pointer group p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${
                        formData.isPopular
                          ? 'bg-brand-500 border-brand-500 ring-2 ring-brand-200 dark:ring-brand-900/30'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-400 dark:group-hover:border-brand-500'
                      }`}>
                        {formData.isPopular && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Mark as Popular Plan
                    </span>
                  </div>
                  {formData.isPopular && (
                    <span className="px-3 py-1 text-xs font-semibold bg-brand-500 text-white rounded-full shadow-sm">
                      Popular
                    </span>
                  )}
                </label>
                <label className="flex items-center justify-between cursor-pointer group p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="sr-only"
                      />
                      <div className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-all ${
                        formData.isActive
                          ? 'bg-brand-500 border-brand-500 ring-2 ring-brand-200 dark:ring-brand-900/30'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-brand-400 dark:group-hover:border-brand-500'
                      }`}>
                        {formData.isActive && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Active Status
                    </span>
                  </div>
                  {formData.isActive && (
                    <span className="px-3 py-1 text-xs font-semibold bg-brand-500 text-white rounded-full shadow-sm">
                      Active
                    </span>
                  )}
                </label>
              </div>
            </div>

            </form>
          </div>
          
          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-8 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={createPlan.isPending || updatePlan.isPending}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  const form = document.getElementById('plan-form') as HTMLFormElement;
                  if (form) {
                    form.requestSubmit();
                  } else {
                    handleSubmit(e as any);
                  }
                }}
                disabled={createPlan.isPending || updatePlan.isPending}
                className="bg-brand-500 text-white hover:bg-brand-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingPlan 
                  ? (updatePlan.isPending ? 'Updating Plan...' : 'Update Plan')
                  : (createPlan.isPending ? 'Creating Plan...' : 'Create Plan')
                }
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} className="max-w-md mx-auto">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-brand-100 dark:bg-brand-900/20 rounded-full">
            <svg className="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
            Confirm {confirmAction.action === 'activate' ? 'Activation' : 'Deactivation'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
            Are you sure you want to <span className="font-semibold text-brand-600 dark:text-brand-400">{confirmAction.action}</span> the plan{' '}
            <span className="font-semibold text-gray-900 dark:text-white">"{confirmAction.plan?.name}"</span>?
            {confirmAction.action === 'deactivate' && (
              <span className="block mt-2 text-sm">This will hide the plan from users but won't affect existing subscriptions.</span>
            )}
          </p>
          
          {/* Confirmation Inputs - Only for Deactivation */}
          {confirmAction.action === 'deactivate' && (
            <div className="mb-6 space-y-4">
              {/* Action Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">"deactivate"</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmActionInput}
                  onChange={(e) => setConfirmActionInput(e.target.value)}
                  placeholder="deactivate"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
                    confirmActionInput && !isActionInputValid()
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : isActionInputValid()
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  autoFocus
                  disabled={togglePlanStatus.isPending}
                />
                {confirmActionInput && !isActionInputValid() && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Please type exactly: <span className="font-mono">"deactivate"</span>
                  </p>
                )}
                {isActionInputValid() && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Action confirmed
                  </p>
                )}
              </div>

              {/* Plan Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type the plan name <span className="font-semibold text-brand-600 dark:text-brand-400">"{confirmAction.plan?.name}"</span> to confirm:
                </label>
                <input
                  type="text"
                  value={confirmPlanNameInput}
                  onChange={(e) => setConfirmPlanNameInput(e.target.value)}
                  placeholder={confirmAction.plan?.name}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white dark:border-gray-600 ${
                    confirmPlanNameInput && !isPlanNameInputValid()
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : isPlanNameInputValid()
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  disabled={togglePlanStatus.isPending}
                />
                {confirmPlanNameInput && !isPlanNameInputValid() && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Please type exactly: <span className="font-mono">"{confirmAction.plan?.name}"</span>
                  </p>
                )}
                {isPlanNameInputValid() && (
                  <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Plan name confirmed
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmModalOpen(false);
                setConfirmAction({ plan: null, action: '' });
                setConfirmActionInput('');
                setConfirmPlanNameInput('');
              }}
              disabled={togglePlanStatus.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmToggleStatus}
              disabled={togglePlanStatus.isPending || (confirmAction.action === 'deactivate' && !isConfirmationValid())}
              className="bg-brand-500 text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {togglePlanStatus.isPending ? 'Processing...' : `Yes, ${confirmAction.action === 'activate' ? 'Activate' : 'Deactivate'}`}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} className="w-full max-w-[95vw] mx-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Security Service Plans - How they will appear on your website
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full">
            {(() => {
              // Separate popular and non-popular plans
              const popularPlans = plans.filter(plan => plan.isPopular);
              const nonPopularPlans = plans.filter(plan => !plan.isPopular);
              
              // Sort non-popular plans by price
              const sortedNonPopular = nonPopularPlans.sort((a, b) => a.price - b.price);
              
              // Create array with popular plan in center
              const centerIndex = Math.floor(sortedNonPopular.length / 2);
              const result = [...sortedNonPopular];
              result.splice(centerIndex, 0, ...popularPlans);
              
              return result;
            })()
              .map((plan) => (
                <div key={plan.id} className={`relative rounded-2xl p-8 flex flex-col h-[700px] flex-1 ${
                  plan.isPopular 
                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white scale-105 shadow-theme-lg' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-theme-sm'
                }`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-brand-500 border-2 border-white  text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                      plan.isPopular 
                        ? 'bg-white/20' 
                        : 'bg-brand-100 dark:bg-brand-900/20'
                    }`}>
                      <svg className={`w-8 h-8 ${plan.isPopular ? 'text-white' : 'text-brand-500'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
                      </svg>
                    </div>
                    <h3 className={`text-xl font-bold ${
                      plan.isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      {plan.name.toUpperCase()}
                    </h3>
                    <div className={`text-4xl font-bold mt-2 ${
                      plan.isPopular ? 'text-white' : 'text-gray-900 dark:text-white'
                    }`}>
                      ${plan.price}
                    </div>
                  </div>

                  <p className={`text-sm mb-6 ${
                    plan.isPopular ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {plan.description}
                  </p>

                  <div className="space-y-3 mb-6 flex-grow">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <svg className={`w-5 h-5 ${
                          plan.isPopular ? 'text-white' : 'text-brand-500'
                        }`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                        </svg>
                        <span className={`text-sm ${
                          plan.isPopular ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-auto ${
                    plan.isPopular
                      ? 'bg-white text-brand-500 hover:bg-gray-50'
                      : 'bg-brand-500 text-white hover:bg-brand-600'
                  }`}>
                    Get Security Assessment
                    <ArrowRightIcon />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
