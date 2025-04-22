import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "../../utils/getCurrentUser";
import {
  listFields,
  listLivestocks
} from "../../graphql/queries";
import {
  updateField as updateFieldMutation,
  createField as createFieldMutation,
  deleteField as deleteFieldMutation
} from "../../graphql/mutations";

const FieldManager = () => {
  const [fields, setFields] = useState([]);
  const [livestock, setLivestock] = useState([]);
  const [fieldForm, setFieldForm] = useState({ name: "", acres: "", notes: "" });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();
  const client = generateClient();


  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;
      await fetchFields(currentUser.id);
      await fetchLivestock(currentUser.id);
    };
    init();
  }, []);

  const fetchFields = async (sub) => {
    try {
      const result = await client.graphql({
        query: listFields,
        variables: { filter: { sub: { eq: sub } } }
      });

      setFields(result.data.listFields.items);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };

  const fetchLivestock = async (sub) => {
    try {
      const result = await client.graphql({
        query: listLivestocks,
        variables: { filter: { sub: { eq: sub } } }
      });

      setLivestock(result.data.listLivestocks.items);
    } catch (error) {
      console.error("Error fetching livestock:", error);
    }
  };

  const handleChange = (e) => {
    setFieldForm({ ...fieldForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { name, acres, notes } = fieldForm;
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("User not found");

      const input = {
        name,
        acres: parseFloat(acres),
        notes,
        sub: user.id,
      };

      if (editingId) {
        input.id = editingId;
        await client.graphql({ query: updateFieldMutation, variables: { input } });
      } else {
        await client.graphql({ query: createFieldMutation, variables: { input } });
      }


      setFieldForm({ name: "", acres: "", notes: "" });
      setEditingId(null);
      await fetchFields(user.id);
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
      await client.graphql({
        query: deleteFieldMutation,
        variables: { input: { id } }
      });
      const user = await getCurrentUser();
      await fetchFields(user.id);
    } catch (err) {
      console.error("Error deleting field:", err);
    }
  };

  const getLivestockInField = (fieldId) => {
    return livestock.filter((l) => l.fieldID === fieldId);
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
        <button onClick={handleSave} className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          {editingId ? "Update Field" : "Add Field"}
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">All Fields</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((field) => {
          const fieldLivestock = getLivestockInField(field.id);
          return (
            <div key={field.id} className="bg-white border rounded-xl p-5 shadow-md hover:shadow-lg transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-green-800 mb-1">{field.name}</h4>
                  <p className="text-sm text-gray-700">{field.acres} acres</p>
                  {field.notes && (
                    <p className="text-xs text-gray-500 italic mt-1">{field.notes}</p>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <button
                    onClick={() => handleEdit(field)}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(field.id)}
                    className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {fieldLivestock.length > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <h5 className="text-sm font-semibold text-gray-800">
                      Livestock Assigned
                    </h5>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      {fieldLivestock.length} animal{fieldLivestock.length !== 1 && "s"}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {fieldLivestock.map((animal) => (
                      <li key={animal.id}>
                        {animal.name} ({animal.species})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>


      <button className="mt-4 px-4 mx-2 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => navigate(-1)}>
        Back To Inventory
      </button>
    </div>
  );
};

export default FieldManager;
