import React from 'react';

// Mobile-optimized loading component
export const MobileLoader = ({
  size = 'md',
  text = 'Loading...',
  showText = true,
  variant = 'spinner'
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        {showText && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className={`${sizes[size]} bg-green-600 rounded-full animate-pulse`}></div>
        {showText && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">{text}</p>
        )}
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizes[size]} animate-spin`}>
        <svg
          className="w-full h-full text-green-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
      {showText && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium">{text}</p>
      )}
    </div>
  );
};

// Inline loading spinner for buttons
export const InlineLoader = ({ size = 'sm' }) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  };

  return (
    <div className={`${sizes[size]} animate-spin`}>
      <svg
        className="w-full h-full text-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

// Skeleton loader for cards
export const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow animate-pulse">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
      <div className="h-20 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
      </div>
    </div>
  );
};

// Page loading overlay
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 z-50 flex items-center justify-center">
      <div className="text-center">
        <MobileLoader size="lg" text={text} />
      </div>
    </div>
  );
};

export default MobileLoader;