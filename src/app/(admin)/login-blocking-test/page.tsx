"use client";
import React, { useState } from 'react';
import { useIsEmailBlocked } from '@/hooks/api/useBlockStatus';
import { useLogin } from '@/hooks/api/useAuth';
import { showToast } from '@/utils/toast';
import Button from '@/components/ui/button/Button';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';

export default function LoginBlockingTestPage() {
  const [email, setEmail] = useState('webnox@admin.com');
  const [password, setPassword] = useState('12345');
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [countdown, setCountdown] = useState(0);
  
  const loginMutation = useLogin();
  const { 
    isBlocked, 
    attempts, 
    remainingMinutes, 
    blockedAt, 
    expiresAt, 
    isLoading: isLoadingBlockStatus 
  } = useIsEmailBlocked(testEmail);

  // Countdown timer for blocked accounts
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBlocked && remainingMinutes > 0) {
      setCountdown(remainingMinutes * 60);
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCountdown(0);
    }
    return () => clearInterval(timer);
  }, [isBlocked, remainingMinutes]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const attemptsRemaining = 3 - attempts;

  const handleLogin = async () => {
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
  };

  const testWrongPassword = async () => {
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
        email: testEmail,
        password: 'wrongpassword',
        deviceInfo: JSON.stringify(deviceInfo)
      });
    } catch (error: any) {
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
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-md2 font-semibold text-black dark:text-white">
          Login Blocking System Test
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Form */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Login Test</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            
            <Button
              onClick={handleLogin}
              disabled={loginMutation.isPending}
              className="w-full"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </div>

        {/* Block Status Monitor */}
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
          <h3 className="text-lg font-semibold mb-4">Block Status Monitor</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Test Email for Blocking</Label>
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Enter email to test blocking"
              />
            </div>
            
            <Button
              onClick={testWrongPassword}
              disabled={loginMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Test Wrong Password (Triggers Blocking)
            </Button>
          </div>

          {/* Block Status Display */}
          {isLoadingBlockStatus ? (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading block status...</p>
            </div>
          ) : isBlocked ? (
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
              <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                Please try again in <strong className="text-red-900 dark:text-red-100">{formatTime(countdown)}</strong>
              </p>
              {blockedAt && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Blocked at: {new Date(blockedAt).toLocaleString()}
                </p>
              )}
              {expiresAt && (
                <p className="text-xs text-red-600 dark:text-red-400">
                  Expires at: {new Date(expiresAt).toLocaleString()}
                </p>
              )}
            </div>
          ) : attempts > 0 ? (
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
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Failed attempts: {attempts}/3
              </p>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Account Status: Normal
                </h4>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                No failed attempts detected. Account is not blocked.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Security Features Info */}
      <div className="mt-6 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-gray-800 p-6">
        <h3 className="text-lg font-semibold mb-4">🔒 Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Implemented Features:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>✅ Single device login enforcement</li>
              <li>✅ Account blocking after 3 failed attempts</li>
              <li>✅ 5-minute block duration</li>
              <li>✅ Real-time attempt tracking</li>
              <li>✅ Automatic block cleanup</li>
              <li>✅ Email notifications for suspicious activity</li>
              <li>✅ Admin force logout capabilities</li>
              <li>✅ Session status monitoring</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Test Credentials:</h4>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div><strong>Admin 1:</strong> webnox@admin.com / 12345</div>
              <div><strong>Admin 2:</strong> webnox1@admin.com / 12345</div>
              <div><strong>User:</strong> user@example.com / password</div>
              <div><strong>Test Email:</strong> test@example.com / any password</div>
            </div>
            
            <h4 className="font-medium text-gray-900 dark:text-white mb-2 mt-4">API Endpoints:</h4>
            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
              <div>POST /api/auth/login</div>
              <div>GET /api/auth/block-status/:email</div>
              <div>POST /api/auth/logout</div>
              <div>POST /api/auth/logout-all</div>
              <div>GET /api/auth/session-status</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
