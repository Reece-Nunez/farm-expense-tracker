import React from "react";
import { useNavigate } from "react-router-dom";


const InventoryItemManager = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inventory Item Manager</h2>
      <p className="text-gray-600 mb-4">
        Track your equipment, hay, and other farm items.
      </p>
      {/* Chicken Flock & Egg Log Forms will go here */}
      <div className="border p-4 rounded-lg text-gray-500 bg-gray-50">
        Coming soon: Inventory Item logging.
      </div>
      <button className="mt-4 px-4 mx-2 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => navigate(-1)}
      >
        Back To Inventory
      </button>
    </div>
  );
};

export default InventoryItemManager;
