import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="space-y-4">
        <button className="p-3 bg-blue-500 text-white rounded w-full" onClick={() => navigate('/add-expense')}>
          Expense Form
        </button>
        <button className="p-3 bg-green-500 text-white rounded w-full" onClick={() => navigate('/add-income')}>
          Income Form
        </button>
        <button className="p-3 bg-purple-500 text-white rounded w-full" onClick={() => navigate('/analytics')}>
          Analytics Dashboard
        </button>
        <Button className="p-3 bg-red-500 text-white rounded w-1/2" onClick={handleSignOut}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Dashboard;
