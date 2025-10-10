import React, { createContext, useContext, useState, useEffect } from 'react';
import { theme, darkTheme } from '../styles/theme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check for saved theme preference or default to light mode
    const saved = localStorage.getItem('harvesTrackr-theme');
    if (saved) {
      return saved === 'dark';
    }
    // Default to light mode instead of system preference
    return false;
  });

  const [currentTheme, setCurrentTheme] = useState(isDarkMode ? darkTheme : theme);

  // Update theme when dark mode changes
  useEffect(() => {
    setCurrentTheme(isDarkMode ? darkTheme : theme);
    localStorage.setItem('harvesTrackr-theme', isDarkMode ? 'dark' : 'light');
    
    // Update CSS custom properties for global theming
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      // Set dark theme CSS variables
      root.style.setProperty('--color-bg-primary', darkTheme.colors.background.primary);
      root.style.setProperty('--color-bg-secondary', darkTheme.colors.background.secondary);
      root.style.setProperty('--color-text-primary', darkTheme.colors.text.primary);
      root.style.setProperty('--color-text-secondary', darkTheme.colors.text.secondary);
      root.style.setProperty('--color-border', darkTheme.colors.border.primary);
    } else {
      root.classList.remove('dark');
      // Set light theme CSS variables
      root.style.setProperty('--color-bg-primary', theme.colors.gray[50]);
      root.style.setProperty('--color-bg-secondary', '#ffffff');
      root.style.setProperty('--color-text-primary', theme.colors.gray[900]);
      root.style.setProperty('--color-text-secondary', theme.colors.gray[600]);
      root.style.setProperty('--color-border', theme.colors.gray[200]);
    }
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('harvesTrackr-theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    theme: currentTheme,
    isDarkMode,
    toggleTheme,
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    borderRadius: currentTheme.borderRadius,
    boxShadow: currentTheme.boxShadow,
    screens: currentTheme.screens,
    components: currentTheme.components,
    animation: currentTheme.animation,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;