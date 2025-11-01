"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { showToast } from "@/utils/toast";
import { useLogin } from "@/hooks/api/useAuth";
import { useApiErrorHandler } from "@/hooks/useApiErrorHandler";
import { useIsEmailBlocked } from "@/hooks/api/useBlockStatus";
import modeService from "@/lib/api/modeService";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("webnox@admin.com");
  const [password, setPassword] = useState("12345");
  const [countdown, setCountdown] = useState(0);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLogin();
  const { handleError } = useApiErrorHandler();

  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || '/';

  // Initialize mode
  useEffect(() => {
    const mode = modeService.getModeFromStorage();
    setIsDevelopmentMode(mode === 'development');
  }, []);

  // Check block status for the email (only in production mode)
  const { 
    isBlocked, 
    attempts, 
    remainingMinutes, 
    blockedAt, 
    expiresAt, 
    isLoading: isLoadingBlockStatus 
  } = useIsEmailBlocked(email, isDevelopmentMode ? false : true);

  // Countdown timer for blocked accounts (production mode only)
  useEffect(() => {
    if (isDevelopmentMode) {
      setCountdown(0);
      return;
    }

    let timer: NodeJS.Timeout;
    if (isBlocked && remainingMinutes > 0) {
      setCountdown(remainingMinutes * 60); // Convert to seconds
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
  }, [isBlocked, remainingMinutes, isDevelopmentMode]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const attemptsRemaining = 3 - attempts;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast.error("Please enter both email and password");
      return;
    }

    // Prevent submission if account is blocked (production mode only)
    if (!isDevelopmentMode && isBlocked) {
      showToast.error(`Account is blocked. Please try again in ${formatTime(countdown)}`);
      return;
    }

    // Show loading toast
    const loadingToast = showToast.loading("Signing in...");
    
    try {
      // Get device information
      const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        timestamp: new Date().toISOString(),
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };
      
      // Call the actual API with device info
      const response = await loginMutation.mutateAsync({
        email,
        password,
        deviceInfo: JSON.stringify(deviceInfo)
      });
      
      showToast.dismiss(loadingToast);
      showToast.success("Login successful! Welcome to the security scanning dashboard.");
      
      // Store user data in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      
      // Redirect to the intended page or dashboard
      router.push(redirectUrl);
    } catch (error: any) {
      showToast.dismiss(loadingToast);
      
      // Handle different error types based on mode
      if (isDevelopmentMode) {
        // Development mode - simple error handling
        showToast.error(error?.response?.data?.error?.message || 'Login failed');
      } else {
        // Production mode - detailed error handling
        if (error?.response?.status === 409 && error?.response?.data?.error?.code === 'USER_ALREADY_LOGGED_IN') {
          const structuredError = {
            response: {
              status: 409,
              data: {
                success: false,
                error: {
                  message: error.response.data.error.message,
                  statusCode: 409,
                  code: 'USER_ALREADY_LOGGED_IN',
                  details: error.response.data.error.details
                }
              }
            }
          };
          handleError(structuredError);
        } else if (error?.response?.status === 423 && error?.response?.data?.error?.code === 'ACCOUNT_BLOCKED') {
          const errorData = error.response.data.error;
          showToast.error(`Account blocked after 3 failed attempts. Please try again in ${errorData.details?.remainingMinutes || 5} minutes.`);
        } else if (error?.response?.status === 401 && error?.response?.data?.error?.code === 'INVALID_CREDENTIALS') {
          const errorData = error.response.data.error;
          const remainingAttempts = errorData.details?.remainingAttempts || 0;
          showToast.error(`Invalid credentials. ${remainingAttempts} attempts remaining before account is blocked.`);
        } else if (error?.response?.status === 403 && error?.response?.data?.error?.code === 'ADMIN_ACCESS_DENIED') {
          showToast.error('Access denied. Admin login is restricted to authorized personnel only.');
        } else {
          // Use the error handler for other errors
          handleError(error);
        }
      }
    }
  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      {/* <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            {/* Mode Indicator */}
            <div className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
              isDevelopmentMode 
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
                : 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200'
            }`}>
              {isDevelopmentMode ? '🔧 Development Mode' : '🔒 Production Mode'}
            </div>

            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Cyberix Security Dashboard
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your credentials to access the security scanning dashboard
            </p>
          </div>
          <div>
            <div className="w-full">
              <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10 w-full">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z"
                    fill="#EB4335"
                  />
                </svg>
                Sign in with Google
              </button>
              {/* <button className="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10">
                <svg
                  width="21"
                  className="fill-current"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.6705 1.875H18.4272L12.4047 8.75833L19.4897 18.125H13.9422L9.59717 12.4442L4.62554 18.125H1.86721L8.30887 10.7625L1.51221 1.875H7.20054L11.128 7.0675L15.6705 1.875ZM14.703 16.475H16.2305L6.37054 3.43833H4.73137L14.703 16.475Z" />
                </svg>
                Sign in with X
              </button> */}
            </div>
            <div className="relative py-3 sm:py-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">
                  Or
                </span>
              </div>
            </div>
            {/* Block Status Display (Production Mode Only) */}
            {!isDevelopmentMode && isBlocked && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Account Blocked
                  </h3>
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
            )}

            {/* Attempts Remaining Display (Production Mode Only) */}
            {!isDevelopmentMode && !isBlocked && attempts > 0 && attemptsRemaining > 0 && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Warning
                  </h3>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  ⚠️ {attemptsRemaining} attempts remaining before account is blocked.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@company.com" 
                    type="email"
                    disabled={!isDevelopmentMode && isBlocked}
                    className={!isDevelopmentMode && isBlocked ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      defaultValue={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="password"
                      disabled={!isDevelopmentMode && isBlocked}
                      className={!isDevelopmentMode && isBlocked ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed' : ''}
                    />
                    <span
                      onClick={() => (!isDevelopmentMode && isBlocked) ? null : setShowPassword(!showPassword)}
                      className={`absolute z-30 -translate-y-1/2 right-4 top-1/2 ${(!isDevelopmentMode && isBlocked) ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}
                    >
                      {showPassword ? (
                        <EyeIcon />
                      ) : (
                        <EyeCloseIcon />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox 
                      checked={isChecked} 
                      onChange={setIsChecked}
                      disabled={!isDevelopmentMode && isBlocked}
                    />
                    <span className={`block font-normal text-theme-sm ${(!isDevelopmentMode && isBlocked) ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-400'}`}>
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className={`text-sm ${(!isDevelopmentMode && isBlocked) ? 'text-gray-400 cursor-not-allowed' : 'text-brand-500 hover:text-brand-600 dark:text-brand-400'}`}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button 
                    className="w-full" 
                    size="sm"
                    disabled={loginMutation.isPending || (!isDevelopmentMode && isBlocked)}
                  >
                    {(!isDevelopmentMode && isBlocked)
                      ? `Blocked - Try again in ${formatTime(countdown)}`
                      : loginMutation.isPending 
                        ? "Signing in..." 
                        : "Sign in"
                    }
                  </Button>
                </div>
              </div>
            </form>

            {/* <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {""}
                <Link
                  href="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
