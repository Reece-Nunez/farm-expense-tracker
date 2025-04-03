import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Livestock, Field, LivestockFamily, MedicalRecord } from "../../models";

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

  useEffect(() => {
    const fetchProfile = async () => {
      const found = await DataStore.query(Livestock, animalId);
      setAnimal(found);

      const familyLinks = await DataStore.query(LivestockFamily);
      const allLivestock = await DataStore.query(Livestock);

      const parentLinks = familyLinks.filter(f => f.childID === animalId);
      const parentAnimals = parentLinks.map(link => allLivestock.find(a => a.id === link.parentID)).filter(Boolean);
      setParents(parentAnimals);

      const childLinks = familyLinks.filter(f => f.parentID === animalId);
      const childAnimals = childLinks.map(link => allLivestock.find(a => a.id === link.childID)).filter(Boolean);
      setOffspring(childAnimals);
    };

    const fetchMedicalRecords = async () => {
      const records = await DataStore.query(MedicalRecord, (r) => r.livestockID.eq(animalId));
      setMedicalRecords(records);
    };

    fetchProfile();
    fetchMedicalRecords();
  }, [animalId]);

  const filteredRecords = medicalRecords.filter(record => {
    const matchesType = filterType ? record.type === filterType : true;
    const matchesDate = filterDate ? record.date === filterDate : true;
    return matchesType && matchesDate;
  });

  if (!animal) return <div className="p-6">Loading...</div>;

  const handleAddRecord = () => {
    navigate(`/dashboard/inventory/livestock/${animalId}/medical-records/new`);
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{animal.name}'s Profile</h2>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setSelectedTab("profile")} className={`px-4 py-2 rounded ${selectedTab === "profile" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Profile
        </button>
        <button onClick={() => setSelectedTab("medical")} className={`px-4 py-2 rounded ${selectedTab === "medical" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Medical Records <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">{medicalRecords.length}</span>
        </button>
      </div>

      {selectedTab === "profile" && (
        <>
          <div className="bg-white rounded shadow p-4 md:p-6 border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Species:</strong> {animal.species}</p>
              <p><strong>Breed:</strong> {animal.breed}</p>
              <p><strong>Birthdate:</strong> {animal.birthdate}</p>
              <p><strong>Weight:</strong> {animal.weight} lbs</p>
              <p><strong>Field:</strong> {animal.location?.name || "N/A"}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Parents</h3>
            {parents.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {parents.map((p) => (
                  <div
                    key={p.id}
                    className="bg-gray-100 border rounded-lg p-4 w-full sm:w-[200px] shadow-sm"
                  >
                    <p className="font-semibold text-lg">{p.name}</p>
                    <p className="text-sm text-gray-600">{p.species}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No known parents</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Offspring</h3>
            {offspring.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {offspring.map((o) => (
                  <div
                    key={o.id}
                    className="bg-gray-100 border rounded-lg p-4 w-full sm:w-[200px] shadow-sm"
                  >
                    <p className="font-semibold text-lg">{o.name}</p>
                    <p className="text-sm text-gray-600">{o.species}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No known offspring</p>
            )}
          </div>
        </>
      )}
      
      {selectedTab === "medical" && (
        <div className="bg-white rounded shadow p-4 md:p-6 border">
          <div className="flex flex-col md:flex-row md:items-end gap-4 mb-4">
            <div>
              <label className="block font-medium text-sm">Filter by Type</label>
              <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border p-2 rounded w-full">
                <option value="">All</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Checkup">Checkup</option>
                <option value="Injury">Injury</option>
                <option value="Deworming">Deworming</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-sm">Filter by Date</label>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="border p-2 rounded w-full" />
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleAddRecord}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                + Add Record
              </button>
              <button
                onClick={() => navigate(`/dashboard/inventory/livestock/${animalId}/medical-records`)}
                className="text-sm px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                View All
              </button>
            </div>
          </div>

          <ul className="space-y-3">
            {filteredRecords.length === 0 ? (
              <li>No medical records found.</li>
            ) : (
              filteredRecords.map(r => (
                <li key={r.id} className="border p-3 rounded shadow-sm bg-gray-50">
                  <div className="font-semibold text-blue-700">{r.type} ({r.date})</div>
                  <div><strong>Medicine:</strong> {r.medicine || "N/A"}</div>
                  <div><strong>Notes:</strong> {r.notes || "None"}</div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <button
        className="mt-6 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </div>
  );
};

export default LivestockProfile;
