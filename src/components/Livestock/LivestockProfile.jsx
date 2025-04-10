import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { generateClient } from "aws-amplify/api";
import { getLivestock, listLivestockFamilies, listMedicalRecords, listLivestocks } from "@/graphql/queries";
import { toast } from "react-hot-toast";

const LivestockProfile = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [parents, setParents] = useState([]);
  const [offspring, setOffspring] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [filterType, setFilterType] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const client = generateClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: livestockData } = await client.graphql({ query: getLivestock, variables: { id: animalId } });

        if (!livestockData?.getLivestock) {
          toast.error("Animal not found.");
          navigate(-1);
          return;
        }

        const found = livestockData.getLivestock;
        setAnimal(found);

        const [familyData, allLivestockData, medicalData] = await Promise.all([
          client.graphql({ query: listLivestockFamilies }),
          client.graphql({ query: listLivestocks }),
          client.graphql({
            query: listMedicalRecords,
            variables: { filter: { livestockID: { eq: animalId } } },
          }),
        ]);

        const families = familyData.data.listLivestockFamilies.items;
        const allLivestock = allLivestockData.data.listLivestocks.items;
        const records = medicalData.data.listMedicalRecords.items;

        const parentLinks = families.filter((f) => f.childID === animalId);
        const parentAnimals = parentLinks.map((link) => allLivestock.find((a) => a.id === link.parentID)).filter(Boolean);
        setParents(parentAnimals);

        const childLinks = families.filter((f) => f.parentID === animalId);
        const childAnimals = childLinks.map((link) => allLivestock.find((a) => a.id === link.childID)).filter(Boolean);
        setOffspring(childAnimals);

        setMedicalRecords(records);
      } catch (err) {
        console.error("Profile fetch error:", err);
        toast.error("Failed to load livestock profile.");
      }
    };

    fetchData();
  }, [animalId, navigate]);

  const handleAddRecord = () => navigate(`/dashboard/inventory/livestock/${animalId}/medical-records/new`);

  const filteredRecords = medicalRecords.filter((record) => {
    const typeMatch = filterType ? record.type === filterType : true;
    const dateMatch = filterDate ? record.date === filterDate : true;
    return typeMatch && dateMatch;
  });

  const handleTabSwitch = (tab) => {
    setSelectedTab(tab);
    setFilterType("");
    setFilterDate("");
  };

  if (!animal) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{animal.name}'s Profile</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => handleTabSwitch("profile")} className={`px-4 py-2 rounded ${selectedTab === "profile" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>Profile</button>
        <button onClick={() => handleTabSwitch("medical")} className={`px-4 py-2 rounded ${selectedTab === "medical" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"}`}>Medical Records <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{medicalRecords.length}</span></button>
      </div>

      {selectedTab === "profile" && (
        <>
          <div className="bg-white rounded shadow p-4 md:p-6 border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Species:</strong> {animal.species || "N/A"}</p>
              <p><strong>Breed:</strong> {animal.breed || "N/A"}</p>
              <p><strong>Birthdate:</strong> {animal.birthdate || "N/A"}</p>
              <p><strong>Weight:</strong> {animal.weight ? `${animal.weight} lbs` : "N/A"}</p>
              <p><strong>Field:</strong> {animal.location?.name || "N/A"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Parents</h3>
            {parents.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {parents.map((p) => (
                  <div key={p.id} className="bg-gray-100 border rounded-lg p-4 w-full sm:w-[200px] shadow-sm">
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-sm text-gray-600">{p.species}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No known parents.</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Offspring</h3>
            {offspring.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {offspring.map((o) => (
                  <div key={o.id} className="bg-gray-100 border rounded-lg p-4 w-full sm:w-[200px] shadow-sm">
                    <p className="font-semibold text-lg">{o.name}</p>
                    <p className="text-sm text-gray-600">{o.species}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No known offspring.</p>
            )}
          </div>
        </>
      )}

      {selectedTab === "medical" && (
        <div className="bg-white rounded shadow p-4 md:p-6 border">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
            <div>
              <label className="block font-medium text-sm">Filter by Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border p-2 rounded w-full">
                <option value="">All</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Checkup">Checkup</option>
                <option value="Injury">Injury</option>
                <option value="Deworming">Deworming</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-sm">Filter by Date</label>
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="border p-2 rounded w-full" />
            </div>
            <div className="flex gap-2 ml-auto">
              <button onClick={handleAddRecord} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">+ Add Record</button>
              <button onClick={() => navigate(`/dashboard/inventory/livestock/${animalId}/medical-records`)} className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">View All</button>
            </div>
          </div>

          <ul className="space-y-3">
            {filteredRecords.length === 0 ? (
              <li className="text-gray-500">No medical records found.</li>
            ) : (
              filteredRecords.map((r) => (
                <li key={r.id} className="border p-3 rounded shadow-sm bg-gray-50">
                  <div className="font-semibold text-blue-700">{r.type} <span className="text-sm text-gray-600">({r.date})</span></div>
                  <div><strong>Medicine:</strong> {r.medicine || "N/A"}</div>
                  <div><strong>Notes:</strong> {r.notes || "None"}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default LivestockProfile;