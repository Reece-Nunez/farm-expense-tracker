// src/components/Inventory/LivestockMedicalRecords.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Livestock, MedicalRecord } from "../../models";

const LivestockMedicalRecords = () => {
    const { animalId } = useParams();
    const navigate = useNavigate();

    const [animal, setAnimal] = useState(null);
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filterType, setFilterType] = useState("");
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const a = await DataStore.query(Livestock, animalId);
            setAnimal(a);

            const all = await DataStore.query(MedicalRecord, (r) => r.livestockID.eq(animalId));
            setRecords(all);
            setFilteredRecords(all);
        };
        fetchData();
    }, [animalId]);

    useEffect(() => {
        let filtered = records;

        if (filterType) {
            filtered = filtered.filter((r) => r.type.toLowerCase().includes(filterType.toLowerCase()));
        }
        if (filterDate) {
            filtered = filtered.filter((r) => r.date === filterDate);
        }
        setFilteredRecords(filtered);
    }, [filterType, filterDate, records]);

    const handleAddRecord = () => {
        navigate(`/dashboard/inventory/livestock/${animalId}/medical-records/new`);
    };

    const navigateBack = () => {
        navigate(-1)
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
                Medical Records for {animal?.name} ({records.length})
            </h2>

            <div className="flex flex-wrap items-center gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Filter by Type"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="p-2 border rounded"
                />
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="p-2 border rounded"
                />
                <button
                    onClick={handleAddRecord}
                    className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Add Medical Record
                </button>
            </div>

            {filteredRecords.length === 0 ? (
                <p className="text-gray-500">No medical records found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 border">Date</th>
                                <th className="px-4 py-2 border">Type</th>
                                <th className="px-4 py-2 border">Medicine</th>
                                <th className="px-4 py-2 border">Notes</th>
                                <th className="px-4 py-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRecords.map((record) => (
                                <tr key={record.id} className="text-center">
                                    <td className="border px-4 py-2">{record.date}</td>
                                    <td className="border px-4 py-2">{record.type}</td>
                                    <td className="border px-4 py-2">{record.medicine || "-"}</td>
                                    <td className="border px-4 py-2">{record.notes || "-"}</td>
                                    <td className="border px-4 py-2">
                                        <button
                                            className="px-2 py-1 text-sm bg-blue-600 text-white rounded mr-2 hover:bg-blue-700"
                                            onClick={() => navigate(`/dashboard/inventory/livestock/${animalId}/medical-records/${record.id}`)}
                                        >
                                            Edit
                                        </button>
                                        {/* Delete logic can go here later */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div>
                <button className="px-4 py-2 text-md bg-blue-600 text-white rounded mr-2 hover:bg-blue-700 mt-4" onClick={navigateBack}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default LivestockMedicalRecords;