import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Field, Livestock } from "../../models";

const FieldManager = () => {
  const [fields, setFields] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [fieldForm, setFieldForm] = useState({ name: "", acres: "", notes: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFields();
    fetchLivestock();
    const sub = DataStore.observe(Field).subscribe(fetchFields);
    return () => sub.unsubscribe();
  }, []);

  const fetchFields = async () => {
    const result = await DataStore.query(Field);
    setFields(result);
  };

  const fetchLivestock = async () => {
    const result = await DataStore.query(Livestock);
    setLivestock(result);
  };

  const handleChange = (e) => {
    setFieldForm({ ...fieldForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { name, acres, notes } = fieldForm;
    try {
      if (editingId) {
        const original = await DataStore.query(Field, editingId);
        await DataStore.save(
          Field.copyOf(original, updated => {
            updated.name = name;
            updated.acres = parseFloat(acres);
            updated.notes = notes;
          })
        );
      } else {
        await DataStore.save(
          new Field({
            name,
            acres: parseFloat(acres),
            notes
          })
        );
      }
      setFieldForm({ name: "", acres: "", notes: "" });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving field:", err);
    }
  };

  const handleEdit = (field) => {
    setEditingId(field.id);
    setFieldForm({ name: field.name, acres: field.acres, notes: field.notes });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this field?")) return;
    try {
      const toDelete = await DataStore.query(Field, id);
      await DataStore.delete(toDelete);
    } catch (err) {
      console.error("Error deleting field:", err);
    }
  };

  const getLivestockInField = (fieldId) => {
    return livestock.filter((l) => l.location?.id === fieldId);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Field & Acreage Manager</h2>

      <div className="bg-gray-50 p-4 rounded-lg border mb-6">
        <h3 className="text-xl font-semibold mb-2">{editingId ? "Edit Field" : "Add New Field"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={fieldForm.name} onChange={handleChange} placeholder="Field Name" className="p-2 border rounded" />
          <input name="acres" value={fieldForm.acres} onChange={handleChange} placeholder="Acres" className="p-2 border rounded" type="number" step="any" />
          <textarea name="notes" value={fieldForm.notes} onChange={handleChange} placeholder="Notes (Optional)" className="p-2 border rounded md:col-span-2" />
        </div>
        <button
          onClick={handleSave}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {editingId ? "Update Field" : "Add Field"}
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-2">All Fields</h3>
      <div className="space-y-4">
        {fields.map((field) => {
          const fieldLivestock = getLivestockInField(field.id);
          return (
            <div key={field.id} className="bg-white border rounded-lg p-4 shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-bold">{field.name}</h4>
                  <p className="text-sm text-gray-600">{field.acres} acres</p>
                  {field.notes && <p className="text-sm text-gray-500 mt-1 italic">{field.notes}</p>}
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(field)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >Edit</button>
                  <button
                    onClick={() => handleDelete(field.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >Delete</button>
                </div>
              </div>
              {fieldLivestock.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-semibold">Livestock in this Field:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {fieldLivestock.map((animal) => (
                      <li key={animal.id}>{animal.name} ({animal.species})</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button className="mt-4 px-4 mx-2 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => navigate(-1)}
      >
        Back To Inventory
      </button>
    </div>
  );
};

export default FieldManager;
