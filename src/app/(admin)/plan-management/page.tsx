"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table";
import { ArrowRightIcon, PencilIcon, TrashBinIcon, EyeIcon, PlusIcon } from "@/icons/index";
import { toast } from "react-hot-toast";

// Plan interface
interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  deliveryDays: number;
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
  deliveryDays: number;
  isPopular: boolean;
  isActive: boolean;
}

// Initial form data
const initialFormData: PlanFormData = {
  name: "",
  price: 0,
  description: "",
  features: [],
  deliveryDays: 0,
  isPopular: false,
  isActive: true,
};

// Mock data for demonstration
const mockPlans: Plan[] = [
  {
    id: "1",
    name: "Basic Security Scan",
    price: 299,
    description: "Comprehensive security assessment to identify vulnerabilities and protect your website from potential threats.",
    features: ["Basic vulnerability scan", "SSL certificate check", "Security headers analysis", "Basic penetration testing", "Detailed security report"],
    deliveryDays: 2,
    isPopular: false,
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "2",
    name: "Professional Security Audit",
    price: 799,
    description: "Advanced security assessment with comprehensive vulnerability scanning and detailed remediation guidance.",
    features: ["Full vulnerability assessment", "OWASP Top 10 analysis", "SQL injection testing", "XSS vulnerability scan", "Security recommendations", "Priority-based remediation"],
    deliveryDays: 5,
    isPopular: true,
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
  {
    id: "3",
    name: "Enterprise Security Suite",
    price: 1499,
    description: "Complete enterprise-grade security solution with continuous monitoring and advanced threat detection.",
    features: ["Comprehensive security audit", "Advanced penetration testing", "Code security analysis", "API security testing", "Continuous monitoring", "24/7 security support", "Compliance reporting"],
    deliveryDays: 7,
    isPopular: false,
    isActive: true,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  },
];

export default function PlanManagement() {
  const [plans, setPlans] = useState<Plan[]>(mockPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.features.length === 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    const planData: Plan = {
      id: editingPlan?.id || Date.now().toString(),
      name: formData.name,
      price: formData.price,
      description: formData.description,
      features: formData.features,
      deliveryDays: formData.deliveryDays,
      isPopular: formData.isPopular,
      isActive: formData.isActive,
      createdAt: editingPlan?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingPlan) {
      setPlans(plans.map(plan => plan.id === editingPlan.id ? planData : plan));
      toast.success("Plan updated successfully!");
    } else {
      setPlans([...plans, planData]);
      toast.success("Plan created successfully!");
    }

    setIsModalOpen(false);
  };

  // Handle edit
  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      description: plan.description,
      features: plan.features,
      deliveryDays: plan.deliveryDays,
      isPopular: plan.isPopular,
      isActive: plan.isActive,
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (planId: string) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      setPlans(plans.filter(plan => plan.id !== planId));
      toast.success("Plan deleted successfully!");
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
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-theme-sm border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
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
              {plans.map((plan) => (
                <TableRow key={plan.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{plan.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</div>
                      </div>
                      {plan.isPopular && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-800 dark:bg-brand-900/20 dark:text-brand-400">
                          Popular
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${plan.price}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Est. {plan.deliveryDays} days delivery
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {plan.features.length} features
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      plan.isActive 
                        ? 'bg-success-100 text-success-800 dark:bg-success-900/20 dark:text-success-400'
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
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(plan.id)}
                        startIcon={<TrashBinIcon />}
                        className="text-error-600 hover:text-error-700 hover:bg-error-50 dark:text-error-400 dark:hover:text-error-300"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add/Edit Plan Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {editingPlan ? 'Edit Plan' : 'Add New Plan'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Plan Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
                placeholder="e.g., Basic Security Scan"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
                placeholder="299"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
                placeholder="Describe the security services included in this plan..."
                rows={3}
                required
              />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Features *
              </label>
              <div className="space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removeFeature(index)}
                      className="text-error-600 hover:text-error-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Add a new feature..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <Button
                    onClick={addFeature}
                    disabled={!newFeature.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Delivery Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Delivery Days *
              </label>
              <input
                type="number"
                value={formData.deliveryDays}
                onChange={(e) => setFormData({ ...formData, deliveryDays: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white"
                placeholder="2"
                required
              />
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isPopular}
                  onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Popular Plan</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Active</span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button>
                {editingPlan ? 'Update Plan' : 'Create Plan'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Security Service Plans - How they will appear on your website
          </h2>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-center items-stretch">
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
                <div key={plan.id} className={`relative rounded-2xl p-8 flex flex-col h-[600px] ${
                  plan.isPopular 
                    ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white scale-105 shadow-theme-lg' 
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-theme-sm'
                }`}>
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-medium">
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
