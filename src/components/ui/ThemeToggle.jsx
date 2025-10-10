import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import Toggle from './Toggle';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';

const ThemeToggle = ({ 
  showLabel = true, 
  size = 'md',
  variant = 'toggle' // 'toggle' | 'button' | 'icon'
}) => {
  const { isDarkMode, toggleTheme } = useTheme();

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <SunIcon className="w-5 h-5 text-yellow-500" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleTheme}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {isDarkMode ? (
          <SunIcon className="w-6 h-6 text-yellow-500" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    );
  }

  // Default toggle variant
  return (
    <div className="flex items-center space-x-3">
      <SunIcon className="w-5 h-5 text-yellow-500" />
      <Toggle
        checked={isDarkMode}
        onChange={toggleTheme}
        size={size}
        label={showLabel ? (isDarkMode ? 'Dark Mode' : 'Light Mode') : null}
      />
      <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </div>
  );
};

export default ThemeToggle;