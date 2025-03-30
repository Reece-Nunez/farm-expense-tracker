// DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/outline";

export default function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  const handleAddExpense = () => {
    navigate("/dashboard/add-expense");
  };

  const handleAddIncome = () => {
    navigate("/dashboard/add-income");
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Mobile Header (for screens < md) */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-end">
        {/* Always a hamburger icon */}
        <button onClick={() => setShowSidebar(true)} className="text-gray-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Main container */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Overlay (click to close sidebar on mobile) */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* SIDEBAR */}
        <aside
          className={`
            fixed top-0 right-0 z-20 h-full w-64 bg-white border-l border-gray-200
            transform transition-transform duration-300
            ${showSidebar ? "translate-x-0" : "translate-x-full"}
            md:static md:translate-x-0 md:border-r md:border-l-0
          `}
        >
          {/* Mobile-only top bar inside sidebar: brand (left) + X (right) */}
          <div className="md:hidden flex items-center p-4 border-b border-gray-200">
            <button
              onClick={() => setShowSidebar(false)}
              className="ml-auto text-gray-700"
            >
              {/* X Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* The actual sidebar nav items */}
          <Sidebar onCloseSidebar={() => setShowSidebar(false)} />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          {/* Buttons to add Expense/Income, pinned at the top */}
          <div
            className={`relative md:sticky md:top-0 flex justify-center md:justify-end m-0 md:m-3 z-10 md:z-50`}
          >
            <button
              onClick={handleAddExpense}
              className="flex items-center m-1 gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5 text-white" />
              Add Expense
            </button>

            <button
              onClick={handleAddIncome}
              className="flex items-center m-1 gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5 text-white" />
              Add Income
            </button>
          </div>

          {/* Where nested routes render */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
