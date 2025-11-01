"use client";
import React, { useState, useEffect } from 'react';
import ModeToggle from '@/components/common/ModeToggle';
import modeService from '@/lib/api/modeService';
import { useIsEmailBlocked } from '@/hooks/api/useBlockStatus';
import { useLogin } from '@/hooks/api/useAuth';
import { showToast } from '@/utils/toast';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';

export default function ModeTestPage() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('wrongpassword');
  const [currentMode, setCurrentMode] = useState<'development' | 'production'>('development');
  const [modeConfig, setModeConfig] = useState(modeService.getModeConfig());
  
  const loginMutation = useLogin();
  const { 
    isBlocked, 
    attempts, 
    remainingMinutes, 
    blockedAt, 
    expiresAt, 
    isLoading: isLoadingBlockStatus 
  } = useIsEmailBlocked(email, currentMode === 'production');

  useEffect(() => {
    const mode = modeService.getModeFromStorage();
    setCurrentMode(mode);
    setModeConfig(modeService.getModeConfig());
  }, []);

  const handleModeChange = (mode: 'development' | 'production') => {
    setCurrentMode(mode);
    setModeConfig(modeService.getModeConfig());
  };

  const testLogin = async () => {
    try {
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timestamp: new Date().toISOString(),
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      await loginMutation.mutateAsync({
        email,
        password,
        deviceInfo: JSON.stringify(deviceInfo)
      });

      showToast.success('Login successful!');
    } catch (error: any) {
      if (currentMode === 'development') {
        showToast.error('Development mode: Simple error handling');
      } else {
        if (error?.response?.status === 423 && error?.response?.data?.error?.code === 'ACCOUNT_BLOCKED') {
          const errorData = error.response.data.error;
          showToast.error(`Account blocked after 3 failed attempts. Please try again in ${errorData.details?.remainingMinutes || 5} minutes.`);
        } else if (error?.response?.status === 401 && error?.response?.data?.error?.code === 'INVALID_CREDENTIALS') {
          const errorData = error.response.data.error;
          const remainingAttempts = errorData.details?.remainingAttempts || 0;
          showToast.error(`Invalid credentials. ${remainingAttempts} attempts remaining before account is blocked.`);
        } else {
          showToast.error(error?.response?.data?.error?.message || 'Login failed');
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const attemptsRemaining = 3 - attempts;

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Mode Testing Dashboard
        </h2>
      </div>

      {/* Mode Toggle */}
      <div className="mb-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Mode Configuration</h3>
        <ModeToggle onModeChange={handleModeChange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mode Information */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Current Mode Information</h3>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              currentMode === 'development'
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
            }`}>
              <h4 className="font-medium mb-2">
                {currentMode === 'development' ? '🔧 Development Mode' : '🔒 Production Mode'}
              </h4>
              <div className="text-sm space-y-1">
                <div><strong>API URL:</strong> {modeConfig.apiUrl}</div>
                <div><strong>Mode:</strong> {modeConfig.mode}</div>
                <div><strong>Is Development:</strong> {modeConfig.isDevelopment ? 'Yes' : 'No'}</div>
                <div><strong>Is Production:</strong> {modeConfig.isProduction ? 'Yes' : 'No'}</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Security Features Status</h4>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={modeService.shouldEnableBlocking() ? 'text-green-600' : 'text-gray-400'}>
                    {modeService.shouldEnableBlocking() ? '✅' : '❌'}
                  </span>
                  <span>Account Blocking: {modeService.getModeSpecificMessage('Enabled')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={modeService.shouldEnableEmailNotifications() ? 'text-green-600' : 'text-gray-400'}>
                    {modeService.shouldEnableEmailNotifications() ? '✅' : '❌'}
                  </span>
                  <span>Email Notifications: {modeService.getModeSpecificMessage('Enabled')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={modeService.shouldEnforceSingleDevice() ? 'text-green-600' : 'text-gray-400'}>
                    {modeService.shouldEnforceSingleDevice() ? '✅' : '❌'}
                  </span>
                  <span>Single Device Login: {modeService.getModeSpecificMessage('Enabled')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Test */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Login Test</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Test Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter test email"
              />
            </div>
            
            <div>
              <Label>Test Password (Use wrong password to test blocking)</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter test password"
              />
            </div>
            
            <Button
              onClick={testLogin}
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? 'Testing...' : 'Test Login'}
            </Button>
          </div>

          {/* Block Status Display (Production Mode Only) */}
          {currentMode === 'production' && isBlocked && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Account Blocked
                </h4>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                This account is temporarily blocked due to multiple failed login attempts.
              </p>
              {blockedAt && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Blocked at: {new Date(blockedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Attempts Warning (Production Mode Only) */}
          {currentMode === 'production' && !isBlocked && attempts > 0 && attemptsRemaining > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Warning
                </h4>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                ⚠️ {attemptsRemaining} attempts remaining before account is blocked.
              </p>
            </div>
          )}

          {/* Development Mode Info */}
          {currentMode === 'development' && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Development Mode
                </h4>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Blocking features are disabled. You can test login without restrictions.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Testing Instructions */}
      <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">Testing Instructions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Development Mode Testing</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div>1. Switch to Development Mode</div>
              <div>2. Try wrong password multiple times</div>
              <div>3. No blocking should occur</div>
              <div>4. Simple error messages shown</div>
              <div>5. Multiple devices can login simultaneously</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Production Mode Testing</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <div>1. Switch to Production Mode</div>
              <div>2. Try wrong password 3 times</div>
              <div>3. Account gets blocked for 5 minutes</div>
              <div>4. Detailed error messages shown</div>
              <div>5. Single device login enforced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
