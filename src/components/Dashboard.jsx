import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "@aws-amplify/auth";
import { Button } from "@/components/ui/button";
// Import some Heroicons for visuals
import {
  CreditCardIcon,
  CashIcon,
  ChartBarIcon,
  CollectionIcon,
  CurrencyDollarIcon,
  LogoutIcon,
} from "@heroicons/react/outline";

function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Define the dashboard "cards" for navigation
  const cards = [
    {
      title: "Expense Form",
      description: "Record a new expense",
      icon: CreditCardIcon,
      bgColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      textColor: "text-white",
      route: "/add-expense",
    },
    {
      title: "Income Form",
      description: "Record new income",
      icon: CashIcon,
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      textColor: "text-white",
      route: "/add-income",
    },
    {
      title: "Analytics",
      description: "View farm analytics",
      icon: ChartBarIcon,
      bgColor: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      textColor: "text-white",
      route: "/analytics",
    },
    {
      title: "Expenses",
      description: "Manage expenses",
      icon: CollectionIcon,
      bgColor: "bg-yellow-400",
      hoverColor: "hover:bg-yellow-500",
      textColor: "text-black",
      route: "/expenses",
    },
    {
      title: "Income",
      description: "Manage income",
      icon: CurrencyDollarIcon,
      bgColor: "bg-gray-800",
      hoverColor: "hover:bg-gray-900",
      textColor: "text-white",
      route: "/income",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Farm Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => navigate(card.route)}
                className={`cursor-pointer p-6 rounded-2xl shadow-lg transform transition hover:scale-105 ${card.bgColor} ${card.hoverColor}`}
              >
                <div className="flex items-center space-x-4">
                  <Icon className="w-12 h-12" />
                  <div>
                    <h2 className={`text-2xl font-bold ${card.textColor}`}>
                      {card.title}
                    </h2>
                    <p className={`text-sm ${card.textColor}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div
            onClick={handleSignOut}
            className="cursor-pointer p-6 rounded-2xl shadow-lg transform transition hover:scale-105 bg-red-500"
          >
            <div className="flex items-center space-x-4">
              <LogoutIcon className="w-12 h-12 text-white" />
              <div>
                <h2 className="text-2xl font-bold text-white">Logout</h2>
                <p className="text-sm text-white">Sign out of your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
