// src/components/Layout/Sidebar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";
import {
  HomeIcon,
  CurrencyDollarIcon,
  CreditCardIcon,
  TableIcon,
  UploadIcon,
  ChartBarIcon,
  LogoutIcon,
  UserIcon
} from "@heroicons/react/outline";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { label: "Dashboard", icon: HomeIcon, route: "/dashboard" },
    { label: "Expenses", icon: CreditCardIcon, route: "/expenses" },
    { label: "Income", icon: CurrencyDollarIcon, route: "/income" },
    { label: "Analytics", icon: ChartBarIcon, route: "/analytics" },
    { label: "Import Expenses CSV", icon: UploadIcon, route: "/import-csv" },
    { label: "Import Income CSV", icon: UploadIcon, route: "/import-income" },
    { label: "Expense Table", icon: TableIcon, route: "/expenses" },
    { label: "Profile", icon: UserIcon, route: "/profile" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 text-xl font-bold">
        Harvest-Hub
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ label, icon: Icon, route }, idx) => (
          <button
            key={idx}
            onClick={() => navigate(route)}
            className="w-full flex items-center gap-2 p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200 mb-20">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 p-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
        >
          <LogoutIcon className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
