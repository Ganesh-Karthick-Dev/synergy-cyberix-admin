'use client';

import React, { useState } from 'react';
import {
  usePlans,
  usePlan,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  usePlansWithSearch,
  useActivePlans,
  usePopularPlans,
  useInactivePlans,
} from '@/hooks/api/useServicePlans';

interface ServicePlansProps {
  planId?: string;
}

export const ServicePlans: React.FC<ServicePlansProps> = ({ planId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(planId || null);
  const [showPlanDetail, setShowPlanDetail] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  // Main plans query with filters
  const { data: plans, isLoading: plansLoading, error: plansError } = usePlans({
    search: searchTerm || undefined,
    status: selectedStatus || undefined,
  });

  // Selected plan detail
  const { data: selectedPlan, isLoading: planLoading } = usePlan(selectedPlanId!);

  // Mutations
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();

  // Specialized queries
  const { data: activePlans } = useActivePlans();
  const { data: popularPlans } = usePopularPlans();
  const { data: inactivePlans } = useInactivePlans();

  const handleCreatePlan = async (planData: any) => {
    try {
      await createPlan.mutateAsync(planData);
      setShowCreateModal(false);
      alert('Plan created successfully!');
    } catch (error) {
      alert('Failed to create plan');
    }
  };

  const handleUpdatePlan = async (planId: string, planData: any) => {
    try {
      await updatePlan.mutateAsync({ id: planId, data: planData });
      setShowEditModal(false);
      setEditingPlan(null);
      alert('Plan updated successfully!');
    } catch (error) {
      alert('Failed to update plan');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (confirm('Are you sure you want to delete this plan?')) {
      try {
        await deletePlan.mutateAsync(planId);
        alert('Plan deleted successfully!');
      } catch (error) {
        alert('Failed to delete plan');
      }
    }
  };

  const handlePlanClick = (planId: string) => {
    setSelectedPlanId(planId);
    setShowPlanDetail(true);
  };

  const handleEditClick = (plan: any) => {
    setEditingPlan(plan);
    setShowEditModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
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
        <p className="text-red-600">{plansError.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Service Plans</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Plan
          </button>
          <div className="text-sm text-gray-500">
            Real API Integration - Service Plans
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Search & Filter Plans</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Plans
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Plans List */}
      {plans && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">
              Service Plans ({plans.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {plans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <div className="text-2xl font-bold text-blue-600">{formatPrice(plan.price)}</div>
                  </div>
                  <div className="flex space-x-1">
                    {plan.isPopular && (
                      <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                        Popular
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        plan.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 3 && (
                      <li className="text-gray-500">+{plan.features.length - 3} more features</li>
                    )}
                  </ul>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Delivery: {plan.deliveryDays} days</span>
                  <span>Created: {new Date(plan.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePlanClick(plan.id)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEditClick(plan)}
                    className="flex-1 px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeletePlan(plan.id)}
                    className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                    disabled={deletePlan.isPending}
                  >
                    {deletePlan.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Detail Modal */}
      {showPlanDetail && selectedPlan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Plan Details</h3>
                <button
                  onClick={() => setShowPlanDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {planLoading ? (
                <div className="text-center py-4">Loading plan details...</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedPlan.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(selectedPlan.price)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <p className="text-sm text-gray-900">{selectedPlan.description}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Features</label>
                    <ul className="text-sm text-gray-900 space-y-1">
                      {selectedPlan.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Delivery Days</label>
                      <p className="text-sm text-gray-900">{selectedPlan.deliveryDays} days</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedPlan.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {selectedPlan.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => setShowPlanDetail(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Create New Plan</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const planData = {
                  name: formData.get('name') as string,
                  price: Number(formData.get('price')),
                  description: formData.get('description') as string,
                  features: (formData.get('features') as string).split('\n').filter(f => f.trim()),
                  deliveryDays: Number(formData.get('deliveryDays')),
                  isPopular: formData.get('isPopular') === 'on',
                  isActive: formData.get('isActive') === 'on',
                };
                handleCreatePlan(planData);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Features (one per line)</label>
                  <textarea
                    name="features"
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Delivery Days</label>
                  <input
                    type="number"
                    name="deliveryDays"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" name="isPopular" className="mr-2" />
                    <span className="text-sm text-gray-700">Popular</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" name="isActive" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    disabled={createPlan.isPending}
                  >
                    {createPlan.isPending ? 'Creating...' : 'Create Plan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Specialized Queries Demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Active Plans ({activePlans?.length || 0})</h3>
          <div className="space-y-2">
            {activePlans?.slice(0, 3).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{plan.name}</div>
                  <div className="text-xs text-gray-500">{formatPrice(plan.price)}</div>
                </div>
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Popular Plans ({popularPlans?.length || 0})</h3>
          <div className="space-y-2">
            {popularPlans?.slice(0, 3).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{plan.name}</div>
                  <div className="text-xs text-gray-500">{formatPrice(plan.price)}</div>
                </div>
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Inactive Plans ({inactivePlans?.length || 0})</h3>
          <div className="space-y-2">
            {inactivePlans?.slice(0, 3).map((plan) => (
              <div key={plan.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">{plan.name}</div>
                  <div className="text-xs text-gray-500">{formatPrice(plan.price)}</div>
                </div>
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
