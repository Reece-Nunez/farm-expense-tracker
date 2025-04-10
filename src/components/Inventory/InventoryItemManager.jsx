import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/getCurrentUser";
import { generateClient } from "aws-amplify/api";
import { listInventoryItems } from "../../graphql/queries";
import { createInventoryItem } from "../../graphql/mutations";

const InventoryItemManager = () => {
  const navigate = useNavigate();
  const [userId, setuserId] = useState(null);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", quantity: "", notes: "" });
  const client = generateClient();

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser();
      if (!user) return;
      if (user) {
        setuserId(user.id);
        fetchItems(user.id);
      }
    };
    init();
  }, []);

  const fetchItems = async (uid) => {
    try {
      const { data } = await client.graphql({
        query: listInventoryItems,
        variables: {
          filter: { userId: { eq: uid } }
        }
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
    if (!newItem.name || !newItem.quantity) return;

    try {
      await client.graphql({
        query: createInventoryItem,
        variables: {
          input: {
            name: newItem.name,
            quantity: parseFloat(newItem.quantity),
            notes: newItem.notes,
            userId
          }
        }
      });

      setNewItem({ name: "", quantity: "", notes: "" });
      fetchItems(userId);
    } catch (error) {
      console.error("Error adding inventory item:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Inventory Item Manager</h2>
      <p className="text-gray-600 mb-4">
        Track your equipment, hay, and other farm items.
      </p>

      {/* Add Item Form */}
      <div className="bg-gray-50 border p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Add New Inventory Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={newItem.name}
            onChange={handleChange}
            placeholder="Item Name"
            className="p-2 border rounded"
          />
          <input
            name="quantity"
            value={newItem.quantity}
            onChange={handleChange}
            placeholder="Quantity"
            type="number"
            step="any"
            className="p-2 border rounded"
          />
          <input
            name="notes"
            value={newItem.notes}
            onChange={handleChange}
            placeholder="Notes (optional)"
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleAddItem}
          className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Item
        </button>
      </div>

      {/* List Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white border p-4 rounded shadow">
            <h4 className="font-semibold">{item.name}</h4>
            <p>Quantity: {item.quantity}</p>
            {item.notes && <p className="text-gray-600 text-sm italic">{item.notes}</p>}
          </div>
        ))}
      </div>

      <button
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={() => navigate(-1)}
      >
        Back To Inventory
      </button>
    </div>
  );
};

export default InventoryItemManager;
