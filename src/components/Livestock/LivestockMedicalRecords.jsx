import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { generateClient } from "aws-amplify/api";
import { getLivestock } from "@/graphql/queries";
import { listMedicalRecords } from "@/graphql/queries";

const LivestockMedicalRecords = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const client = generateClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: animalData } = await clientgraphql({
          query: getLivestock,
          variables: { id: animalId },
        });
        
        if (!animalData?.getLivestock) {
          toast.error("Animal not found.");
          navigate(-1);
          return;
        }

        setAnimal(animalData.getLivestock);

        const { data: recordData } = await clientgraphql({
          query: listMedicalRecords,
          variables: {
            filter: { livestockID: { eq: animalId } },
            limit: 1000,
          },
        });
              

        const items = recordData?.listMedicalRecords?.items || [];
        setRecords(items);
        setFilteredRecords(items);
      } catch (err) {
        console.error("[LivestockMedicalRecords] Fetch error:", err);
        toast.error("Error loading records.");
      }
    };

    fetchData();
  }, [animalId, navigate]);

  useEffect(() => {
    let result = [...records];

    if (filterType) {
      result = result.filter((r) =>
        r.type?.toLowerCase().includes(filterType.toLowerCase())
      );
    }

    if (filterDate) {
      result = result.filter((r) => r.date === filterDate);
    }

    setFilteredRecords(result);
  }, [filterType, filterDate, records]);

  const handleAddRecord = () =>
    navigate(`/dashboard/inventory/livestock/${animalId}/medical-records/new`);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">
        Medical Records for {animal?.name}{" "}
        <span className="text-gray-500 font-normal">
          ({filteredRecords.length})
        </span>
      </h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Filter by Type"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 border rounded w-full md:w-auto"
        />
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="p-2 border rounded w-full md:w-auto"
        />
        <button
          onClick={handleAddRecord}
          className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Medical Record
        </button>
      </div>

      {filteredRecords.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No records found.</p>
      ) : (
        <div className="overflow-x-auto border rounded shadow">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Medicine</th>
                <th className="px-4 py-2 border">Notes</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{record.date}</td>
                  <td className="border px-4 py-2">{record.type}</td>
                  <td className="border px-4 py-2">{record.medicine || "-"}</td>
                  <td className="border px-4 py-2">{record.notes || "-"}</td>
                  <td className="border px-4 py-2 text-center">
                    <button
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      onClick={() =>
                        navigate(
                          `/dashboard/inventory/livestock/${animalId}/medical-records/${record.id}`
                        )
                      }
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-6">
        <button
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default LivestockMedicalRecords;
