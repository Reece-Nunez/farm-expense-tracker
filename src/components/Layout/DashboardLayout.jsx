import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className="h-screen w-screen flex flex-col">
      {/* Mobile Header (for screens < md) */}
      <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Harvest-Hub</h1>

        {/* Always a hamburger icon */}
        <button
          onClick={() => setShowSidebar(true)}
          className="text-gray-700"
        >
          {/* Hamburger Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </header>

      {/* Main container */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Overlay (click to close sidebar) */}
        {showSidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* SIDEBAR: slides in from the right on mobile */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Your existing sidebar navigation items */}
          <Sidebar onCloseSidebar={() => setShowSidebar(false)} />
          </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
