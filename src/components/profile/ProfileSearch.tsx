"use client";
import React, { useState } from 'react';
import Profile from './Profile';
import modeService from '@/lib/api/modeService';
import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import Button from '@/components/ui/button/Button';

export default function ProfileSearch() {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  React.useEffect(() => {
    setIsDevelopmentMode(modeService.isDevelopmentMode());
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSearchEmail(email.trim());
    }
  };

  const handleClear = () => {
    setEmail('');
    setSearchEmail('');
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Profile Search</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Search and view user profiles without authentication</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          isDevelopmentMode 
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200'
        }`}>
          {isDevelopmentMode ? '🔧 Development Mode' : '🔒 Production Mode'}
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email address"
              required
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              🔍 Search Profile
            </Button>
            <Button type="button" onClick={handleClear} variant="outline">
              🗑️ Clear
            </Button>
          </div>
        </form>
      </div>

      {/* Profile Results */}
      {searchEmail && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Showing profile for: {searchEmail}
            </span>
          </div>
          <Profile email={searchEmail} />
        </div>
      )}

      {/* Test Information */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Test Emails</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span><strong>Admin 1:</strong> webnox@admin.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span><strong>Admin 2:</strong> webnox1@admin.com</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span><strong>User:</strong> user1@cyberix.com</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features</h4>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                <span>No login required</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                <span>Access to all user data</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                <span>Recent login activity</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                <span>Active sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                <span>Subscription information</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400">✅</span>
                <span>Security statistics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


