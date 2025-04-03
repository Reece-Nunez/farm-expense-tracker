import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DataStore } from "@aws-amplify/datastore";
import { Livestock, Field, LivestockFamily } from "../../models";

const LivestockProfile = () => {
  const { animalId } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [parents, setParents] = useState([]);
  const [offspring, setOffspring] = useState([]);

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

    fetchProfile();
  }, [animalId]);

  if (!animal) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{animal.name}'s Profile</h2>
      <div className="bg-white rounded shadow p-6 border mb-6">
        <p><strong>Species:</strong> {animal.species}</p>
        <p><strong>Breed:</strong> {animal.breed}</p>
        <p><strong>Birthdate:</strong> {animal.birthdate}</p>
        <p><strong>Weight:</strong> {animal.weight} lbs</p>
        <p><strong>Field:</strong> {animal.location?.name || "N/A"}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold">Parents</h3>
        <ul className="list-disc ml-6">
          {parents.length > 0 ? parents.map(p => (
            <li key={p.id}>{p.name} ({p.species})</li>
          )) : <li>No known parents</li>}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold">Offspring</h3>
        <ul className="list-disc ml-6">
          {offspring.length > 0 ? offspring.map(c => (
            <li key={c.id}>{c.name} ({c.species})</li>
          )) : <li>No known offspring</li>}
        </ul>
      </div>

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
