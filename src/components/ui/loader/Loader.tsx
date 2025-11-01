"use client";

import React from 'react';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: { container: 'w-16 h-16', strokeWidth: '6', fontSize: 'text-sm font-bold' },
    md: { container: 'w-28 h-28', strokeWidth: '8', fontSize: 'text-base font-bold' },
    lg: { container: 'w-40 h-40', strokeWidth: '10', fontSize: 'text-xl font-bold' },
  };

  const currentSize = sizeClasses[size];
  const isInline = className.includes('!m-0');

  return (
    <div 
      className={`flex flex-col items-center justify-center gap-2 ${isInline ? 'inline-flex' : ''} ${className}`}
    >
      {/* Circular Progress */}
      <div className={`relative ${currentSize.container} flex items-center justify-center ${isInline ? 'flex-shrink-0' : ''}`}>
        <div className="loader-spinner">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              {/* Orange gradient from light (tail) to dark (head) */}
              <linearGradient id={`orange-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#feb273" stopOpacity="1" />
                <stop offset="50%" stopColor="#fd853a" stopOpacity="1" />
                <stop offset="100%" stopColor="#ec4a0a" stopOpacity="1" />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth={currentSize.strokeWidth}
              className="text-gray-200 dark:text-gray-700"
              opacity="0.3"
            />
            {/* Progress circle with gradient */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`url(#orange-gradient-${size})`}
              strokeWidth={currentSize.strokeWidth}
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset="188.4"
              className="loader-circle"
            />
          </svg>
        </div>
      </div>

      {/* CYBERIX Text - Below the circle */}
      <div 
        className={`${currentSize.fontSize} text-brand-600 dark:text-brand-400 whitespace-nowrap text-center`}
        style={{ 
          fontFamily: 'Clouds, sans-serif',
          letterSpacing: '0.15em',
        }}
      >
        CYBERIX
      </div>

      <style jsx>{`
        .loader-spinner {
          animation: rotate 2s linear infinite;
          transform-origin: center center;
        }

        .loader-circle {
          animation: dash 1.5s ease-in-out infinite;
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes dash {
          0% {
            stroke-dasharray: 1, 251.2;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 188.4, 251.2;
            stroke-dashoffset: -62.8;
          }
          100% {
            stroke-dasharray: 188.4, 251.2;
            stroke-dashoffset: -251.2;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
