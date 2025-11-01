"use client";
import React, { useState, useEffect } from 'react';
import modeService from '@/lib/api/modeService';

interface ModeToggleProps {
  onModeChange?: (mode: 'development' | 'production') => void;
  className?: string;
}

export default function ModeToggle({ onModeChange, className = '' }: ModeToggleProps) {
  const [currentMode, setCurrentMode] = useState<'development' | 'production'>('development');

  useEffect(() => {
    const mode = modeService.getModeFromStorage();
    setCurrentMode(mode);
  }, []);

  const handleModeChange = (mode: 'development' | 'production') => {
    modeService.setMode(mode);
    setCurrentMode(mode);
    onModeChange?.(mode);
    
    // Show a toast notification
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showToast', {
        detail: {
          type: 'info',
          message: `Switched to ${mode} mode. Page will reload to apply changes.`,
          duration: 3000
        }
      });
      window.dispatchEvent(event);
    }

    // Reload the page after a short delay to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className={`mode-toggle ${className}`}>
      <div className="flex items-center justify-center space-x-4">
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Application Mode:
        </div>
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              currentMode === 'development'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => handleModeChange('development')}
          >
            🔧 Development
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              currentMode === 'production'
                ? 'bg-purple-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => handleModeChange('production')}
          >
            🔒 Production
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        {currentMode === 'development' ? (
          <span>Relaxed security for development and testing</span>
        ) : (
          <span>Full security features enabled for production</span>
        )}
      </div>
    </div>
  );
}
