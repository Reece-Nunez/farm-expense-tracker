import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-4">
        <button className="p-3 bg-blue-500 text-white rounded w-full">
          Expense Form
        </button>
        <button className="p-3 bg-green-500 text-white rounded w-full">
          Income Form
        </button>
        <button className="p-3 bg-purple-500 text-white rounded w-full">
          Analytics Dashboard
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
