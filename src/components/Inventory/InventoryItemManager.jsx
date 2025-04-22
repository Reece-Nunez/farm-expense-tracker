import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/getCurrentUser";
import { generateClient } from "aws-amplify/api";
import { listInventoryItems } from "../../graphql/queries";
import { createInventoryItem } from "../../graphql/mutations";

const InventoryItemManager = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [userSub, setUserSub] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    notes: "",
    type: "",
  });
  const [selectedType, setSelectedType] = useState("All");
  const client = generateClient();

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      setUserId(user.id);
      setUserSub(user.sub);
      fetchItems(user.sub);
    };
    init();
  }, []);

  const fetchItems = async (sub) => {
    try {
      const { data } = await client.graphql({
        query: listInventoryItems,
        variables: {
          filter: { sub: { eq: sub } },
        },
      });
      setItems(data.listInventoryItems.items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.type) {
      console.warn("Missing required fields");
      return;
    }

    try {
      await client.graphql({
        query: createInventoryItem,
        variables: {
          input: {
            sub: userSub,
            name: newItem.name,
            quantity: parseFloat(newItem.quantity),
            notes: newItem.notes,
            type: newItem.type,
          },
        },
      });

      setNewItem({ name: "", quantity: "", notes: "", type: "" });
      fetchItems(userSub);
    } catch (error) {
      console.error("Error adding inventory item:", error);
    }
  };

  const inventoryTypes = useMemo(() => {
    const types = [...new Set(items.map((item) => item.type))];
    return ["All", ...types];
  }, [items]);

  const filteredItems = useMemo(() => {
    const sorted = [...items].sort((a, b) => a.quantity - b.quantity);
    return selectedType === "All"
      ? sorted
      : sorted.filter((item) => item.type === selectedType);
  }, [items, selectedType]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inventory Item Manager</h2>
      <p className="text-gray-600 mb-4">
        Add and manage your farm's inventory, grouped by type and sorted by quantity.
      </p>

      {/* Add Item Form */}
      <div className="bg-gray-50 border p-4 rounded-lg mb-8">
        <h3 className="font-semibold mb-3">Add New Inventory Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={newItem.name}
            onChange={handleChange}
            placeholder="Item Name"
            className="p-2 border rounded"
          />

          <select
            name="type"
            value={newItem.type}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="Equipment">Equipment</option>
            <option value="Hay">Hay</option>
            <option value="Tools">Tools</option>
            <option value="Feed">Feed</option>
            <option value="Tractor Implement">Tractor Implement</option>
          </select>

          {/* Quantity with Dynamic Label */}
          <div className="flex items-center">
            <input
              name="quantity"
              value={newItem.quantity}
              onChange={handleChange}
              placeholder="Quantity"
              type="number"
              step="any"
              className="p-2 border rounded w-full"
            />
            {newItem.type === "Hay" && (
              <span className="ml-2 text-gray-600">bales</span>
            )}
            {newItem.type === "Feed" && (
              <span className="ml-2 text-gray-600">lbs</span>
            )}
          </div>

          <input
            name="notes"
            value={newItem.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
            className="p-2 border rounded md:col-span-3"
          />
        </div>

        <button
          onClick={handleAddItem}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Item
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Inventory</h3>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          {inventoryTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Grouped Inventory Display */}
      {inventoryTypes
        .filter((type) => type !== "All")
        .filter((type) => selectedType === "All" || selectedType === type)
        .map((type) => (
          <div key={type} className="mb-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-2">{type}</h4>
            <div className="space-y-4">
              {filteredItems
                .filter((item) => item.type === type)
                .map(({ id, name, quantity, notes }) => (
                  <div
                    key={id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h5 className="text-md font-medium">{name}</h5>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Qty</span>
                        <p className="text-xl font-bold text-green-700">
                          {quantity}
                        </p>
                      </div>
                    </div>
                    {notes && (
                      <p className="text-sm text-gray-700 italic border-t pt-2">
                        {notes}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}

      <button
        className="mt-10 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => navigate(-1)}
      >
        Back To Inventory Dashboard
      </button>
    </div>
  );
};

export default InventoryItemManager;
