import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCow, faEgg, faTractor, faWarehouse  } from "@fortawesome/free-solid-svg-icons";

const sections = [
  { name: "Livestock", route: "/dashboard/inventory/livestock", icon: faCow },
  { name: "Chicken Flocks", route: "/dashboard/inventory/chickens", icon: faEgg },
  { name: "Fields & Acreage", route: "/dashboard/inventory/fields", icon: faWarehouse },
  { name: "Feed, Hay & Equipment", route: "/dashboard/inventory/items", icon: faTractor }
];

const InventoryDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Farm Inventory Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {sections.map(({ name, route, icon }) => (
          <button
            key={name}
            onClick={() => navigate(route)}
            className="rounded-2xl shadow-lg p-6 bg-white hover:bg-gray-100 transition text-lg font-semibold border border-gray-200 flex items-center space-x-4"
          >
            <FontAwesomeIcon icon={icon} className="text-2xl" />
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className="text-center mt-20">
        <h1>Please be paitent, this is a new feature and is not 100% ready yet.</h1>
      </div>
    </div>
    
  );
};

export default InventoryDashboard;
