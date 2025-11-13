import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/modal';
import { User } from '@/lib/api/services';
import { getAdminUserSubscription, getAdminUserProjects, getAdminUserReports } from '@/lib/api/user-management';
import { Calendar, CreditCard, Package, FileText, Globe, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface UserDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

type TabType = 'subscription' | 'projects';

export default function UserDetailsModal({ isOpen, onClose, user }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('subscription');
  const [subscription, setSubscription] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchUserData();
    } else {
      // Reset state when modal closes
      setSubscription(null);
      setProjects([]);
      setReports([]);
      setError(null);
      setActiveTab('subscription');
    }
  }, [isOpen, user]);

  const fetchUserData = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch subscription
      const userId = typeof user.id === 'string' ? user.id : user.id.toString();
      const subResponse = await getAdminUserSubscription(userId);
      if (subResponse.success && subResponse.data) {
        setSubscription(subResponse.data);
      }

      // Fetch projects
      const projectsResponse = await getAdminUserProjects(userId, true);
      if (projectsResponse.success && projectsResponse.data) {
        setProjects(projectsResponse.data);
      }

      // Fetch reports (scans)
      const reportsResponse = await getAdminUserReports(userId);
      if (reportsResponse.success && reportsResponse.data) {
        setReports(reportsResponse.data);
      }
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getDaysRemaining = (endDate: string | null | undefined) => {
    if (!endDate) return 'Lifetime';
    try {
      const end = new Date(endDate);
      const now = new Date();
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diff < 0) return 'Expired';
      return `${diff} days`;
    } catch {
      return 'N/A';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'OPEN':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'EXPIRED':
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[90%] max-w-6xl max-h-[90vh] flex flex-col">
      <div className="flex flex-col h-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-8 pt-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                User Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.firstName} {user.lastName} ({user.email})
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('subscription')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'subscription'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>Subscription</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'projects'
                  ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Projects & Scans</span>
                {projects.length > 0 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                    {projects.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <button
                  onClick={fetchUserData}
                  className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  {subscription ? (
                    <>
                      {/* Plan Info */}
                      <div className="bg-gradient-to-r from-brand-50 to-orange-50 dark:from-brand-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-brand-200 dark:border-brand-800">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                              {subscription.plan?.name || 'FREE'} Plan
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {subscription.plan?.description || 'No plan description'}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            subscription.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {subscription.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Start Date</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {formatDate(subscription.startDate)}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">End Date</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {subscription.endDate ? formatDate(subscription.endDate) : 'Lifetime'}
                            </p>
                          </div>

                          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Days Remaining</span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {getDaysRemaining(subscription.endDate)}
                            </p>
                          </div>
                        </div>

                        {/* Plan Features */}
                        {subscription.plan?.features && (
                          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Plan Limits</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Max Projects</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {subscription.plan.features.maxProjects === -1 
                                    ? 'Unlimited' 
                                    : subscription.plan.features.maxProjects || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Max Scans/Project</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {subscription.plan.features.maxScansPerProject === -1 
                                    ? 'Unlimited' 
                                    : subscription.plan.features.maxScansPerProject || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Max Scans</span>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {subscription.plan.features.maxScans === -1 
                                    ? 'Unlimited' 
                                    : subscription.plan.features.maxScans || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Payment Info */}
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <CreditCard className="w-4 h-4" />
                          <span>Payment Method: {subscription.paymentMethod || 'N/A'}</span>
                          {subscription.autoRenew && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded text-xs">
                              Auto-Renew Enabled
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">No active subscription found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">User is on FREE plan</p>
                    </div>
                  )}
                </div>
              )}

              {/* Projects & Scans Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Projects Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Projects ({projects.length})
                    </h3>
                    {projects.length > 0 ? (
                      <div className="space-y-3">
                        {projects.map((project) => {
                          const projectReports = reports.filter(r => r.projectId === project.id);
                          return (
                            <div
                              key={project.id}
                              className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {project.name}
                                  </h4>
                                  {project.target && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                      <Globe className="w-4 h-4 flex-shrink-0" />
                                      <a 
                                        href={project.target} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="truncate hover:text-brand-600 dark:hover:text-brand-400 hover:underline transition-colors"
                                        title={project.target}
                                      >
                                        {project.target}
                                      </a>
                                    </div>
                                  )}
                                  {project.description && (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                      {project.description}
                                    </p>
                                  )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  project.status === 'ACTIVE'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}>
                                  {project.status}
                                </span>
                              </div>

                              {/* Scans for this project */}
                              {projectReports.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Scans ({projectReports.length})
                                  </p>
                                  <div className="space-y-2">
                                    {projectReports.slice(0, 5).map((report: any) => (
                                      <div
                                        key={report.id}
                                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-sm"
                                      >
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                          <span className="text-gray-900 dark:text-white truncate">
                                            {report.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                          {report.severity && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(report.severity)}`}>
                                              {report.severity}
                                            </span>
                                          )}
                                          {report.status && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                                              {report.status}
                                            </span>
                                          )}
                                          <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(report.createdAt)}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                    {projectReports.length > 5 && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
                                        +{projectReports.length - 5} more scans
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">No projects found</p>
                      </div>
                    )}
                  </div>

                  {/* All Scans Summary */}
                  {reports.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        All Scans ({reports.length})
                      </h3>
                      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Title
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Project
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Severity
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                  Date
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                              {reports.map((report: any) => (
                                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    {report.title}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                    {report.project?.name || 'No Project'}
                                  </td>
                                  <td className="px-4 py-3">
                                    {report.severity && (
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(report.severity)}`}>
                                        {report.severity}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {report.status && (
                                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(report.status)}`}>
                                        {report.status}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(report.createdAt)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

