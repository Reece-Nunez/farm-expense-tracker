import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { PlusIcon, HomeIcon, CreditCardIcon, CurrencyDollarIcon, CollectionIcon } from "@heroicons/react/outline";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "../ui/button";
import ThemeToggle from "../ui/ThemeToggle";
import { haptics } from "../../utils/haptics";

export default function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowBottomNav(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setShowSidebar(false);
    setShowFABMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFABMenu && !event.target.closest('[data-fab-menu]')) {
        setShowFABMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchend', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchend', handleClickOutside);
    };
  }, [showFABMenu]);

  const handleAddExpense = (event) => {
    event?.stopPropagation();
    setShowFABMenu(false);
    setShowSidebar(false);
    navigate("/dashboard/add-expense");
  };

  const handleAddIncome = (event) => {
    event?.stopPropagation();
    setShowFABMenu(false);
    setShowSidebar(false);
    navigate("/dashboard/add-income");
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
      <header className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {getPageTitle()}
            </h1>
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle variant="icon" showLabel={false} />
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

      <div className="flex flex-1 overflow-hidden relative">
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        <aside
          className={`
            fixed top-0 right-0 z-50 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700
            transform transition-transform duration-300 ease-in-out
            ${showSidebar ? "translate-x-0" : "translate-x-full"}
            lg:static lg:translate-x-0 lg:border-r lg:border-l-0 lg:w-64
          `}
        >
          <div className="lg:hidden flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">H</span>
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

          <Sidebar onCloseSidebar={() => setShowSidebar(false)} />
        </aside>

        <main className="flex-1 overflow-y-auto pb-24 lg:pb-0 mobile-scroll">
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

          <Outlet />
        </main>
      </div>

      <nav className={`
        lg:hidden fixed bottom-0 left-0 right-0 z-30
        bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700
        transition-transform duration-300 ease-in-out mobile-safe-area
        ${showBottomNav ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="grid grid-cols-5 h-20 px-2">
          <NavButton 
            icon={HomeIcon} 
            label="Dashboard" 
            onClick={() => navigate('/dashboard')}
            active={location.pathname === '/dashboard'}
          />
          <NavButton
            icon={CreditCardIcon}
            label="Expenses"
            onClick={() => navigate('/dashboard/expenses')}
            active={location.pathname.includes('/expenses')}
          />
          
          <div className="relative flex items-center justify-center" data-fab-menu>
            {showFABMenu && (
              <div className="absolute -top-80 flex flex-col gap-3" data-fab-menu>
                <div className="flex flex-col items-center gap-1" data-fab-menu>
                  <button
                    onClick={() => {
                      haptics.light();
                      setShowFABMenu(false);
                      navigate('/dashboard/scan-receipt');
                    }}
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#7c3aed',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                    title="Scan Receipt"
                    type="button"
                    data-fab-menu
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 whitespace-nowrap" data-fab-menu>
                    Scan Receipt
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1" data-fab-menu>
                  <button
                    onClick={() => {
                      haptics.light();
                      setShowFABMenu(false);
                      navigate("/dashboard/add-expense");
                    }}
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#ea580c',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                    title="Add Expense"
                    type="button"
                    data-fab-menu
                  >
                    <CreditCardIcon className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 whitespace-nowrap" data-fab-menu>
                    Add Expense
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1" data-fab-menu>
                  <button
                    onClick={() => {
                      haptics.light();
                      setShowFABMenu(false);
                      navigate("/dashboard/add-income");
                    }}
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#2563eb',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                    title="Add Income"
                    type="button"
                    data-fab-menu
                  >
                    <CurrencyDollarIcon className="w-6 h-6 text-white" />
                  </button>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-600 whitespace-nowrap" data-fab-menu>
                    Add Income
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                haptics.medium();
                setShowFABMenu(!showFABMenu);
              }}
              style={{
                position: 'absolute',
                top: '-20px',
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                backgroundColor: showFABMenu ? '#dc2626' : '#16a34a',
                border: 'none',
                cursor: 'pointer',
                zIndex: 60,
                transform: showFABMenu ? 'rotate(45deg)' : 'rotate(0deg)',
                touchAction: 'manipulation'
              }}
              type="button"
            >
              <PlusIcon className="w-6 h-6 text-white" style={{ pointerEvents: 'none' }} />
            </button>
          </div>

          <NavButton
            icon={CurrencyDollarIcon}
            label="Income"
            onClick={() => navigate('/dashboard/income')}
            active={location.pathname.includes('/income')}
          />
          <NavButton
            icon={CollectionIcon}
            label="Inventory"
            onClick={() => navigate('/dashboard/inventory')}
            active={location.pathname.includes('/inventory')}
          />
        </div>
      </nav>
    </div>
  );
}

const NavButton = ({ icon: Icon, label, onClick, active = false }) => {
  const handleClick = () => {
    haptics.light();
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center px-1 py-2 transition-all duration-200
        min-h-[60px] touch-manipulation select-none
        ${active
          ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }
        rounded-lg mx-1 active:scale-95
      `}
    >
      <div className="w-7 h-7 flex items-center justify-center mb-1">
        {typeof Icon === 'string' ? (
          <span className="text-xl">{Icon}</span>
        ) : (
          <Icon className="w-6 h-6" />
        )}
      </div>
      <span className="text-[10px] font-medium leading-tight">{label}</span>
    </button>
  );
};
