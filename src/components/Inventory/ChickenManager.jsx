import React, { useEffect, useState } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { ChickenFlock, EggLog, Expense } from "../../models";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon, CheckIcon, XIcon } from "@heroicons/react/outline";

const CHICKEN_FEED_KEYWORDS = ["chicken feed", "poultry grain", "laying pellets", "scratch", "hens feed"];

const ChickenManager = () => {
  const [flocks, setFlocks] = useState([]);
  const [eggLogs, setEggLogs] = useState([]);
  const [feedExpenses, setFeedExpenses] = useState([]);
  const [newFlock, setNewFlock] = useState({ breed: "", count: "", hasRooster: false, notes: "" });
  const [newEggLog, setNewEggLog] = useState({ flockId: "", date: "", eggsCollected: "" });
  const [editingFlockId, setEditingFlockId] = useState(null);
  const [editedFlock, setEditedFlock] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [fetchedFlocks, fetchedEggLogs, allExpenses] = await Promise.all([
      DataStore.query(ChickenFlock),
      DataStore.query(EggLog),
      DataStore.query(Expense)
    ]);

    const feedRelated = allExpenses.filter(exp =>
      exp.lineItems?.some(item =>
        CHICKEN_FEED_KEYWORDS.some(keyword => item.item?.toLowerCase().includes(keyword))
      )
    );

    setFlocks(fetchedFlocks);
    setEggLogs(fetchedEggLogs);
    setFeedExpenses(feedRelated);
  };

  const handleEditFlock = (flockId) => {
    navigate(`/dashboard/inventory/chickens/edit/${flockId}`);
  };

  const handleDeleteFlock = async (flockId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this flock?");
    if (!confirmDelete) return;

    try {
      const toDelete = await DataStore.query(ChickenFlock, flockId);
      await DataStore.delete(toDelete);
      setFlocks(prev => prev.filter(f => f.id !== flockId));
    } catch (error) {
      console.error("Error deleting flock:", error);
      alert("Something went wrong while deleting.");
    }
  };

  const handleEdit = (flock) => {
    setEditingFlockId(flock.id);
    setEditedFlock({ ...flock });
  };

  const handleChange = (field, value) => {
    setEditedFlock(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const original = await DataStore.query(ChickenFlock, editingFlockId);
    await DataStore.save(ChickenFlock.copyOf(original, updated => {
      updated.breed = editedFlock.breed;
      updated.count = parseInt(editedFlock.count);
      updated.hasRooster = editedFlock.hasRooster;
      updated.notes = editedFlock.notes;
    }));
    setEditingFlockId(null);
    fetchData();
  };

  const handleCancel = () => {
    setEditingFlockId(null);
    setEditedFlock({});
  };

  const handleDelete = async (flockId) => {
    if (confirm("Delete this flock?")) {
      const toDelete = await DataStore.query(ChickenFlock, flockId);
      await DataStore.delete(toDelete);
      fetchData();
    }
  };

  const handleAddFlock = async () => {
    if (!newFlock.breed || !newFlock.count) return;
    await DataStore.save(new ChickenFlock({
      breed: newFlock.breed,
      count: parseInt(newFlock.count),
      hasRooster: newFlock.hasRooster,
      notes: newFlock.notes
    }));
    setNewFlock({ breed: "", count: "", notes: "" });
    fetchData();
  };

  const handleAddEggLog = async () => {
    if (!newEggLog.flockId || !newEggLog.date || !newEggLog.eggsCollected) return;
    await DataStore.save(new EggLog({
      chickenFlockID: newEggLog.flockId,
      date: newEggLog.date,
      eggsCollected: parseInt(newEggLog.eggsCollected)
    }));
    setNewEggLog({ flockId: "", date: "", eggsCollected: "" });
    fetchData();
  };

  const totalChickens = flocks.reduce((sum, f) => sum + f.count, 0);
  const totalEggs = eggLogs.reduce((sum, log) => sum + log.eggsCollected, 0);
  const totalFeedSpent = feedExpenses.reduce((sum, exp) => sum + (exp.grandTotal || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Chicken Manager</h2>
      <p className="text-gray-600 mb-6">Track flocks, daily egg collection, and feed expenses.</p>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow p-4 rounded border">
          <p className="text-sm text-gray-500">Flocks</p>
          <p className="text-xl font-bold">{flocks.length}</p>
        </div>
        <div className="bg-white shadow p-4 rounded border">
          <p className="text-sm text-gray-500">Total Chickens</p>
          <p className="text-xl font-bold">{totalChickens}</p>
        </div>
        <div className="bg-white shadow p-4 rounded border">
          <p className="text-sm text-gray-500">Eggs Collected</p>
          <p className="text-xl font-bold">{totalEggs}</p>
        </div>
        <div className="bg-white shadow p-4 rounded border">
          <p className="text-sm text-gray-500">Feed Expense</p>
          <p className="text-xl font-bold">${totalFeedSpent.toFixed(2)}</p>
        </div>
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

      {/* Related Feed Expenses */}
      <div className="bg-white p-4 rounded border shadow my-4">
        <h3 className="text-lg font-bold mb-4">Feed-Related Expenses</h3>
        <ul className="space-y-3">
          {feedExpenses.map(exp => (
            <li key={exp.id} className="border p-3 rounded bg-gray-50">
              {new Date(exp.date).toLocaleDateString()} — {exp.vendor} — ${exp.grandTotal?.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChickenManager;
