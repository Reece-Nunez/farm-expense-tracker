import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { PlusIcon, HomeIcon } from "@heroicons/react/outline";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/button";

export default function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  // Hide/show bottom nav on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBottomNav(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close sidebar when route changes
  useEffect(() => {
    setShowSidebar(false);
    setShowFABMenu(false);
  }, [location.pathname]);

  // Close FAB menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showFABMenu) {
        setShowFABMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showFABMenu]);

  const handleAddExpense = () => {
    navigate("/dashboard/add-expense");
    setShowSidebar(false);
  };

  const handleAddIncome = () => {
    navigate("/dashboard/add-income");
    setShowSidebar(false);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.includes('expenses')) return 'Expenses';
    if (path.includes('income')) return 'Income';
    if (path.includes('scan-receipt')) return 'Receipt Scanner';
    if (path.includes('invoices')) return 'Invoices';
    if (path.includes('customers')) return 'Customers';
    if (path.includes('inventory')) return 'Inventory';
    if (path.includes('reports')) return 'Reports';
    if (path.includes('profile')) return 'Profile';
    return 'HarvesTrackr';
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Mobile Header */}
      <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🌾</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getPageTitle()}
            </h1>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSidebar(true)} 
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay (click to close sidebar on mobile) */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? "translate-x-0" : "translate-x-full"}
            lg:static lg:translate-x-0 lg:border-r lg:border-l-0 lg:w-64
          `}
        >
          {/* Mobile-only top bar inside sidebar */}
          <div className="lg:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🌾</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">HarvesTrackr</h2>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* The actual sidebar nav items */}
          <Sidebar onCloseSidebar={() => setShowSidebar(false)} />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          {/* Desktop quick action buttons */}
          <div className="hidden lg:block sticky top-0 z-20 bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-end gap-3">
              <Button variant="outline" size="sm" onClick={handleAddExpense}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
              <Button variant="primary" size="sm" onClick={handleAddIncome}>
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Income
              </Button>
            </div>
          </div>

          {/* Where nested routes render */}
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-30 
        bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700
        transition-transform duration-300 ease-in-out
        ${showBottomNav ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="grid grid-cols-5 h-16">
          <NavButton 
            icon={HomeIcon} 
            label="Dashboard" 
            onClick={() => navigate('/dashboard')}
            active={location.pathname === '/dashboard'}
          />
          <NavButton 
            icon="💸" 
            label="Expenses" 
            onClick={() => navigate('/dashboard/expenses')}
            active={location.pathname.includes('/expenses')}
          />
          
          {/* Central FAB */}
          <div className="relative flex items-center justify-center">
            {/* FAB Menu Options */}
            {showFABMenu && (
              <div className="absolute -top-44 flex flex-col gap-2">
                <button
                  onClick={() => {
                    navigate('/dashboard/scan-receipt');
                    setShowFABMenu(false);
                  }}
                  className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
                  title="Scan Receipt"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    handleAddExpense();
                    setShowFABMenu(false);
                  }}
                  className="w-12 h-12 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
                  title="Add Expense"
                >
                  <span className="text-white text-lg">💸</span>
                </button>
                <button
                  onClick={() => {
                    navigate('/dashboard/add-income');
                    setShowFABMenu(false);
                  }}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105"
                  title="Add Income"
                >
                  <span className="text-white text-lg">💰</span>
                </button>
              </div>
            )}
            
            <button
              onClick={() => setShowFABMenu(!showFABMenu)}
              className={`absolute -top-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all transform ${
                showFABMenu ? 'bg-red-600 hover:bg-red-700 rotate-45' : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <PlusIcon className="w-6 h-6 text-white" />
            </button>
          </div>

          <NavButton 
            icon="💰" 
            label="Income" 
            onClick={() => navigate('/dashboard/income')}
            active={location.pathname.includes('/income')}
          />
          <NavButton 
            icon="📦" 
            label="Inventory" 
            onClick={() => navigate('/dashboard/inventory')}
            active={location.pathname.includes('/inventory')}
          />
        </div>
      </nav>
    </div>
  );
}

// Mobile Navigation Button Component
const NavButton = ({ icon: Icon, label, onClick, active = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center px-2 py-2 transition-colors
        ${active 
          ? 'text-green-600 dark:text-green-400' 
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
        }
      `}
    >
      <div className="w-6 h-6 flex items-center justify-center mb-1">
        {typeof Icon === 'string' ? (
          <span className="text-lg">{Icon}</span>
        ) : (
          <Icon className="w-5 h-5" />
        )}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};
