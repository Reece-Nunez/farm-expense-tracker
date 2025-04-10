import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getLivestock } from "@/graphql/queries";
import { createMedicalRecord } from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";
const LivestockMedicalForm = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: "",
    date: "",
    notes: "",
    medicine: ""
  });
  const client = generateClient();

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const { data } = await client.graphql({
          query: getLivestock,
          variables: { id: animalId },
        });
        if (!data?.getLivestock) {
          toast.error("Animal not found.");
          navigate(-1);
          return;
        }
        setAnimal(data.getLivestock);
      } catch (err) {
        toast.error("Error fetching animal.");
        console.error("[LivestockMedicalForm] fetch error:", err);
      }
    };
    fetchAnimal();
  }, [animalId, navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type || !form.date) {
      toast.error("Type and Date are required.");
      return;
    }

    setLoading(true);

    try {
      const input = {
        type: form.type,
        date: form.date,
        notes: form.notes,
        medicine: form.medicine,
        livestockID: animalId
      };
      await client.graphql({
        query: createMedicalRecord,
        variables: { input },
      });
      toast.success("Medical record saved.");
      navigate(`/dashboard/inventory/livestock/${animalId}`);
    } catch (err) {
      console.error("[LivestockMedicalForm] save error:", err);
      toast.error("Failed to save record.");
    } finally {
      setLoading(false);
    }
  };

  if (!animal) {
    return <div className="p-6 text-center">Loading animal data...</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Add Medical Record for {animal.name}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="Vaccination">Vaccination</option>
            <option value="Checkup">Checkup</option>
            <option value="Injury">Injury</option>
            <option value="Deworming">Deworming</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Medicine</label>
          <input
            type="text"
            name="medicine"
            value={form.medicine}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Optional"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            placeholder="Optional notes or observations"
          ></textarea>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Record"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default LivestockMedicalForm;
