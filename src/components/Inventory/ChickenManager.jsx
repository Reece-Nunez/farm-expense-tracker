import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/getCurrentUser";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";import {
  listChickenFlocks,
  listEggLogs,
  listLineItems,
  getExpense
} from "../../graphql/queries";
import {
  faCrow,
  faBowlFood,
  faEgg,
  faList,
  faSeedling,
  faDollarSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  createChickenFlock as createChickenFlockMutation,
  updateChickenFlock as updateChickenFlockMutation,
  deleteChickenFlock as deleteChickenFlockMutation,
  createEggLog as createEggLogMutation
} from "../../graphql/mutations";
import { Button } from "@/components/ui/button";
import {
  PencilAltIcon,
  TrashIcon,
  CheckIcon,
  XIcon
} from "@heroicons/react/outline";

const CHICKEN_FEED_KEYWORDS = ["chicken feed", "poultry grain", "laying pellets", "scratch", "hens feed", "layer pellet"];

const ChickenManager = () => {
  const [flocks, setFlocks] = useState([]);
  const [eggLogs, setEggLogs] = useState([]);
  const [feedExpenses, setFeedExpenses] = useState([]);
  const [newFlock, setNewFlock] = useState({ breed: "", count: "", hasRooster: false, notes: "" });
  const [newEggLog, setNewEggLog] = useState({ flockId: "", date: "", eggsCollected: "" });
  const [editingFlockId, setEditingFlockId] = useState(null);
  const [editedFlock, setEditedFlock] = useState({});
  const [user, setUser] = useState(null);
  const client = generateClient();
  const navigate = useNavigate();


  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      setUser(currentUser);
      fetchData(currentUser);
    };
    init();
  }, []);

  const fetchData = async (user) => {
    const [fetchedFlocks, fetchedEggLogs, fetchedLineItems] = await Promise.all([
      client.graphql({ query: listChickenFlocks, variables: { filter: { sub: { eq: user.id } } } }),
      client.graphql({ query: listEggLogs, variables: { filter: { sub: { eq: user.id } } } }),
      client.graphql({ query: listLineItems, variables: { filter: { sub: { eq: user.id } }, limit: 1000 } })
    ]);

    const flocks = fetchedFlocks.data.listChickenFlocks.items;
    const eggLogs = fetchedEggLogs.data.listEggLogs.items;
    const lineItems = fetchedLineItems.data.listLineItems.items;

    const feedRelated = [];
    for (const item of lineItems) {
      if (!CHICKEN_FEED_KEYWORDS.some(keyword => item.item?.toLowerCase().includes(keyword))) continue;
      try {
        const { data } = await client.graphql({ query: getExpense, variables: { id: item.expenseID } });
        const expense = data.getExpense;
        if (expense) {
          feedRelated.push({
            id: item.id,
            lineTotal: item.lineTotal,
            expenseDate: expense.date,
            vendor: expense.vendor
          });
        }
      } catch (err) {
        console.warn("Failed to fetch expense for line item", item.id);
      }
    }

    setFlocks(flocks);
    setEggLogs(eggLogs);
    setFeedExpenses(feedRelated);
  }



  const handleEdit = (flock) => {
    setEditingFlockId(flock.id);
    setEditedFlock({ ...flock });
  };

  const handleChange = (field, value) => {
    setEditedFlock(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const input = {
      id: editingFlockId,
      breed: editedFlock.breed,
      count: parseInt(editedFlock.count),
      hasRooster: editedFlock.hasRooster,
      notes: editedFlock.notes,
      sub: user.id
    };
    await client.graphql({ query: updateChickenFlockMutation, variables: { input } });
    setEditingFlockId(null);
    fetchData(user);
  };

  const handleCancel = () => {
    setEditingFlockId(null);
    setEditedFlock({});
  };

  const handleDelete = async (flockId) => {
    if (confirm("Delete this flock?")) {
      await client.graphql({ query: deleteChickenFlockMutation, variables: { input: { id: flockId } } });
      fetchData(user);
    }
  };

  const handleAddFlock = async () => {
    if (!newFlock.breed || !newFlock.count) return;
    const input = {
      breed: newFlock.breed,
      count: parseInt(newFlock.count),
      hasRooster: newFlock.hasRooster,
      notes: newFlock.notes,
      sub: user.id
    };
    await client.graphql({ query: createChickenFlockMutation, variables: { input } });
    setNewFlock({ breed: "", count: "", hasRooster: false, notes: "" });
    fetchData(user);
  };

  const handleAddEggLog = async () => {
    if (!newEggLog.flockId || !newEggLog.date || !newEggLog.eggsCollected) return;
    const input = {
      chickenFlockID: newEggLog.flockId,
      date: newEggLog.date,
      eggsCollected: parseInt(newEggLog.eggsCollected),
      sub: user.id
    };
    await client.graphql({ query: createEggLogMutation, variables: { input } });
    setNewEggLog({ flockId: "", date: "", eggsCollected: "" });
    fetchData(user);
  };

  // Calculations
  const totalChickens = flocks.reduce((sum, f) => sum + f.count, 0);
  const totalEggs = eggLogs.reduce((sum, log) => sum + log.eggsCollected, 0);
  const totalFeedSpent = feedExpenses.reduce((sum, item) => sum + (item?.lineTotal ?? 0), 0);
  const feedCostPerEgg = totalEggs > 0 ? (totalFeedSpent / totalEggs).toFixed(2) : "0.00";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chicken Manager</h2>
      <p className="text-gray-600 mb-6">Track flocks, daily egg collection, and feed expenses.</p>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-5 gap-4 mb-10">
        <StatCard label="Flocks" value={flocks.length} icon={faList} />
        <StatCard label="Total Chickens" value={totalChickens} icon={faCrow} />
        <StatCard label="Eggs Collected" value={totalEggs} icon={faEgg} />
        <StatCard label="Feed Expense" value={`$${totalFeedSpent.toFixed(2)}`} icon={faBowlFood} />
        <StatCard label="Feed Cost / Egg" value={`$${feedCostPerEgg}`} icon={faDollarSign} />
      </div>

      {/* Add Flock */}
      <div className="bg-gray-50 p-4 rounded border mb-6">
        <h3 className="font-semibold mb-2">Add Chicken Flock</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input placeholder="Breed" value={newFlock.breed} onChange={e => setNewFlock({ ...newFlock, breed: e.target.value })} className="border p-2 rounded" />
          <input type="number" placeholder="Count" value={newFlock.count} onChange={e => setNewFlock({ ...newFlock, count: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Notes (optional)" value={newFlock.notes} onChange={e => setNewFlock({ ...newFlock, notes: e.target.value })} className="border p-2 rounded" />
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasRooster"
              checked={newFlock.hasRooster}
              onChange={(e) => setNewFlock({ ...newFlock, hasRooster: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="hasRooster">Has Rooster</label>
          </div>

        </div>
        <Button className="mt-3 bg-green-600 hover:bg-green-700 text-white" onClick={handleAddFlock}>Add Flock</Button>
        <button className="mt-4 px-4 mx-2 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => navigate(-1)}
        >
          Back To Inventory
        </button>
      </div>

      {/* Add Egg Log */}
      <div className="bg-gray-50 p-4 rounded border mb-6">
        <h3 className="font-semibold mb-2">Log Eggs Collected</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          <select value={newEggLog.flockId} onChange={e => setNewEggLog({ ...newEggLog, flockId: e.target.value })} className="border p-2 rounded">
            <option value="">Select Flock</option>
            {flocks.map(f => <option key={f.id} value={f.id}>{f.breed} ({f.count})</option>)}
          </select>
          <input type="date" value={newEggLog.date} onChange={e => setNewEggLog({ ...newEggLog, date: e.target.value })} className="border p-2 rounded" />
          <input type="number" placeholder="Eggs Collected" value={newEggLog.eggsCollected} onChange={e => setNewEggLog({ ...newEggLog, eggsCollected: e.target.value })} className="border p-2 rounded" />
        </div>
        <Button className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white" onClick={handleAddEggLog}>Log Eggs</Button>
      </div>

      {/* Chicken Flocks */}
      <div className="bg-white p-4 rounded border shadow">
        <h3 className="text-lg font-bold mb-4">Flocks</h3>
        {flocks.map(flock => (
          <div key={flock.id} className="border rounded p-4 shadow-sm bg-gray-50 relative">
            {editingFlockId === flock.id ? (
              <div className="space-y-2">
                <input
                  value={editedFlock.breed}
                  onChange={e => handleChange("breed", e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <input
                  type="number"
                  value={editedFlock.count}
                  onChange={e => handleChange("count", e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editedFlock.hasRooster ?? false}
                    onChange={(e) => handleChange("hasRooster", e.target.checked)}
                  />
                  <span>Has Rooster</span>
                </label>
                <textarea
                  value={editedFlock.notes}
                  onChange={e => handleChange("notes", e.target.value)}
                  className="border p-2 rounded w-full"
                />
                <div className="flex gap-2">
                  <button onClick={handleSave} className="text-green-600 flex items-center">
                    <CheckIcon className="h-5 w-5 mr-1" /> Save
                  </button>
                  <button onClick={handleCancel} className="text-gray-500 flex items-center">
                    <XIcon className="h-5 w-5 mr-1" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>Breed:</strong> {flock.breed}</p>
                <p><strong>Count:</strong> {flock.count}</p>
                <p><strong>Has Rooster:</strong> {flock.hasRooster ? "Yes" : "No"}</p>
                {flock.notes && <p className="text-sm italic text-gray-600">{flock.notes}</p>}
                <div className="absolute top-2 right-2 flex space-x-3">
                  <button onClick={() => handleEdit(flock)} className="text-blue-600">
                    <PencilAltIcon className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(flock.id)} className="text-red-600">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Egg Logs */}
      <div className="bg-white p-4 rounded border shadow my-4">
        <h3 className="text-lg font-bold mb-4">Recent Egg Logs</h3>
        <ul className="space-y-2">
          {eggLogs.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10).map(log => {
            const flock = flocks.find(f => f.id === log.chickenFlockID);
            return (
              <li key={log.id} className="bg-yellow-50 p-3 rounded border">
                {log.date} — {log.eggsCollected} eggs from {flock?.breed || "Unknown Flock"}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Feed Expense Table */}
      <div className="bg-white p-4 rounded border shadow mb-10">
        <h3 className="text-lg font-bold mb-4">Feed Expense Details</h3>
        {feedExpenses.length === 0 ? (
          <p className="text-sm text-gray-500">No feed-related expenses found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border">Date</th>
                  <th className="px-3 py-2 border">Item</th>
                  <th className="px-3 py-2 border">Vendor</th>
                  <th className="px-3 py-2 border text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {feedExpenses.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate)).map(exp => (
                  <tr key={exp.id} className="border-b">
                    <td className="px-3 py-2">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                    <td className="px-3 py-2">{exp.item}</td>
                    <td className="px-3 py-2">{exp.vendor || "Unknown Vendor"}</td>
                    <td className="px-3 py-2 text-right text-green-700 font-medium">
                      ${exp.lineTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white p-4 rounded-lg border shadow text-center">
    <FontAwesomeIcon icon={icon} className="text-green-500 mb-2 text-xl" />
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default ChickenManager;
