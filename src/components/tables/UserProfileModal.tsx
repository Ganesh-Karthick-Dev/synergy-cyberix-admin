"use client";
import React from 'react';
import { Modal } from '../ui/modal';
import { usePublicProfile } from '@/hooks/api/usePublicProfile';
import modeService from '@/lib/api/modeService';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
  userName?: string;
}

export default function UserProfileModal({ isOpen, onClose, userEmail, userName }: UserProfileModalProps) {
  const { data: profile, isLoading, error } = usePublicProfile(userEmail, isOpen && !!userEmail);
  const isDevelopmentMode = modeService.isDevelopmentMode();

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const formatUserAgent = (userAgent: string | null | undefined) => {
    if (!userAgent) return 'Unknown';
    const browser = userAgent.includes('Chrome') ? 'Chrome' : 
                   userAgent.includes('Firefox') ? 'Firefox' : 
                   userAgent.includes('Safari') ? 'Safari' : 'Unknown Browser';
    return browser;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              User Profile Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {userName || userEmail}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isDevelopmentMode 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
              : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
          }`}>
            {isDevelopmentMode ? '🔧 Development Mode' : '🔒 Production Mode'}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error Loading Profile</h3>
            </div>
            <p className="text-sm text-red-700 dark:text-red-300">
              {error?.message || 'Failed to load profile data'}
            </p>
          </div>
        )}

        {/* Profile Content */}
        {profile && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Name</label>
                  <p className="text-gray-900 dark:text-white">
                    {profile.user.firstName} {profile.user.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email</label>
                  <p className="text-gray-900 dark:text-white">{profile.user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Role</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    profile.user.role === 'ADMIN' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
                  }`}>
                    {profile.user.role}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    profile.user.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200'
                  }`}>
                    {profile.user.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Phone</label>
                  <p className="text-gray-900 dark:text-white">{profile.user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Email Verified</label>
                  <span className={`inline-flex items-center gap-2 ${
                    profile.user.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {profile.user.emailVerified ? (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">Yes</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">No</span>
                      </>
                    )}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">2FA Enabled</label>
                  <span className={`inline-flex items-center gap-2 ${
                    profile.user.twoFactorEnabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {profile.user.twoFactorEnabled ? (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">Yes</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium">No</span>
                      </>
                    )}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Last Login</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(profile.user.lastLoginAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Member Since</label>
                  <p className="text-gray-900 dark:text-white">{formatDate(profile.user.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.loginLogsCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Login Logs</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.stats.activeSessionsCount}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Sessions</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-700 rounded-lg">
                  <div className={`text-2xl font-bold ${profile.stats.isOnline ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {profile.stats.isOnline ? '🟢' : '🔴'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Online Status</div>
                </div>
              </div>
            </div>

            {/* Recent Login Activity */}
            {profile.recentLogins && profile.recentLogins.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Login Activity</h3>
                <div className="space-y-3">
                  {profile.recentLogins.slice(0, 5).map((log: any, index: number) => (
                    <div key={log.id || index} className={`p-3 rounded-lg border ${
                      log.success 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg">{log.success ? '✅' : '❌'}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{formatDate(log.createdAt)}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                        <div><strong>IP:</strong> {log.ipAddress}</div>
                        <div><strong>Browser:</strong> {formatUserAgent(log.userAgent)}</div>
                        <div><strong>Reason:</strong> {log.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Sessions */}
            {profile.activeSessions && profile.activeSessions.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                  {profile.activeSessions.map((session: any, index: number) => (
                    <div key={session.id || index} className="p-3 bg-white dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {session.deviceInfo ? JSON.parse(session.deviceInfo).platform || 'Unknown Device' : 'Unknown Device'}
                        </span>
                        <span className={`text-sm ${session.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {session.isActive ? '🟢 Active' : '🔴 Expired'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div><strong>IP:</strong> {session.ipAddress}</div>
                        <div><strong>Browser:</strong> {formatUserAgent(session.userAgent)}</div>
                        <div><strong>Login:</strong> {formatDate(session.loginTime)}</div>
                        <div><strong>Expires:</strong> {formatDate(session.expiresAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Data Messages */}
            {(!profile.recentLogins || profile.recentLogins.length === 0) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Login Activity</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">No recent login activity</p>
              </div>
            )}

            {(!profile.activeSessions || profile.activeSessions.length === 0) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">No active sessions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}


