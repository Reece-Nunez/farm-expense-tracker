import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResponsiveLivestockTable from "../Livestock/ResponsiveLivestockTable";
import { getCurrentUser } from "@/utils/getCurrentUser";
import {
  listLivestocks,
  listFields,
  listLivestockFamilies
} from "@/graphql/queries";
import {
  createLivestock,
  updateLivestock,
  deleteLivestock,
  createLivestockFamily,
  deleteLivestockFamily
} from "@/graphql/mutations";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

const LivestockManager = () => {
  const [livestock, setLivestock] = useState([]);
  const [fields, setFields] = useState([]);
  const [families, setFamilies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [user, setUser] = useState(null);
  const [newAnimal, setNewAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    birthdate: "",
    weight: "",
    gender: "",
    locationId: ""
  });
  const [selectedParents, setSelectedParents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      setUser(currentUser);
      await fetchFields(currentUser.sub);
      await fetchLivestock(currentUser.sub);
      await fetchFamilies(currentUser.sub);
    };

    init();
  }, []);

  const fetchLivestock = async (sub) => {
    const { data } = await client.graphql({
      query: listLivestocks,
      variables: {
        filter: { sub: { eq: sub } },
        limit: 1000
      }
    });
    setLivestock(data.listLivestocks.items);
  };

  const fetchFields = async (sub) => {
    const { data } = await client.graphql({
      query: listFields,
      variables: { filter: { sub: { eq: sub } }, limit: 1000 }
    });
    setFields(data.listFields.items);
  };

  const fetchFamilies = async (sub) => {
    const { data } = await client.graphql({
      query: listLivestockFamilies,
      variables: { filter: { sub: { eq: sub } }, limit: 1000 }
    });
    setFamilies(data.listLivestockFamilies.items);
  };

  const handleChange = (e) => {
    setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdateAnimal = async () => {
    const { name, species, breed, birthdate, weight, gender, locationId } = newAnimal;
    const sub = user?.attributes?.sub || user?.sub;
  
    try {
      let savedAnimal;
  
      const input = {
        name,
        species,
        breed,
        birthdate,
        weight: parseFloat(weight),
        gender,
        fieldID: locationId || null,
        sub,
      };
  
      if (editingId) {
        input.id = editingId;
  
        const { data } = await client.graphql({
          query: `
            mutation UpdateLivestock($input: UpdateLivestockInput!) {
              updateLivestock(input: $input) {
                id
                name
                species
                breed
                birthdate
                weight
                gender
                fieldID
                sub
                createdAt
                updatedAt
              }
            }
          `,
          variables: { input },
        });
  
        savedAnimal = data.updateLivestock;
  
        const existingLinks = families.filter((f) => f.childID === editingId);
        await Promise.all(
          existingLinks.map((link) =>
            client.graphql({
              query: deleteLivestockFamily,
              variables: { input: { id: link.id } },
            })
          )
        );
      } else {
        const { data } = await client.graphql({
          query: `
            mutation CreateLivestock($input: CreateLivestockInput!) {
              createLivestock(input: $input) {
                id
                name
                species
                breed
                birthdate
                weight
                gender
                fieldID
                sub
                createdAt
                updatedAt
              }
            }
          `,
          variables: { input },
        });
  
        savedAnimal = data.createLivestock;
      }
  
      for (const parentID of selectedParents) {
        await client.graphql({
          query: createLivestockFamily,
          variables: {
            input: {
              parentID,
              childID: savedAnimal.id,
              sub,
            },
          },
        });
      }
  
      // ✅ Clear form after success
      setNewAnimal({
        name: "",
        species: "",
        breed: "",
        birthdate: "",
        weight: "",
        gender: "",
        locationId: "",
      });
      setSelectedParents([]);
      setEditingId(null);
  
      await fetchLivestock(sub);
      await fetchFamilies(sub);
    } catch (err) {
      console.error("Error saving animal:", err);
    }
  };
  

  const handleEdit = (animal) => {
    setEditingId(animal.id);
    setNewAnimal({
      name: animal.name || "",
      species: animal.species || "",
      breed: animal.breed || "",
      birthdate: animal.birthdate || "",
      weight: animal.weight || "",
      gender: animal.gender || "",
      locationId: animal.fieldID || ""
    });
    const parentLinks = families.filter((f) => f.childID === animal.id);
    setSelectedParents(parentLinks.map((f) => f.parentID));
  };

  const handleDelete = async (animalId) => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    try {
      const parentLinks = families.filter(
        (f) => f.childID === animalId || f.parentID === animalId
      );
      await Promise.all(
        parentLinks.map((link) =>
          client.graphql({
            query: deleteLivestockFamily,
            variables: { input: { id: link.id } }
          })
        )
      );
      await client.graphql({
        query: deleteLivestock,
        variables: { input: { id: animalId } }
      });
      const sub = user?.attributes?.sub || user?.sub;
      await fetchLivestock(sub);
      await fetchFamilies(sub);
    } catch (err) {
      console.error("Failed to delete animal:", err);
    }
  };

  const getParents = (childId) => {
    const parentLinks = families.filter((f) => f.childID === childId);
    const parentNames = parentLinks.map((link) => {
      const parent = livestock.find((a) => a.id === link.parentID);
      return parent?.name || "Unknown";
    });
    return parentNames.join(", ");
  };

  const getChildren = (parentId) => {
    const childLinks = families.filter((f) => f.parentID === parentId);
    const childNames = childLinks.map((link) => {
      const child = livestock.find((l) => l.id === link.childID);
      return child?.name || "Unknown";
    });
    return childNames.join(", ");
  };

  const handleViewProfile = (animalId) => {
    navigate(`/dashboard/inventory/livestock/${animalId}`);
  };

  return (
    <div className="p-6 w-full max-w-screen-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Livestock Manager</h2>

      {/* -------- FORM -------- */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border shadow-sm">
        <h3 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Animal" : "Add New Animal"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={newAnimal.name} onChange={handleChange} placeholder="Animal's Name" className="p-2 border rounded" />
          <select name="species" value={newAnimal.species} onChange={handleChange} placeholder="Species" className="p-2 border rounded">
            <option value="">Select Species</option>
            <option value="Cow">Cow</option>
            <option value="Pig">Pig</option>
            <option value="Goat">Goat</option>
            <option value="Sheep">Sheep</option>
          </select>
          <input name="breed" value={newAnimal.breed} onChange={handleChange} placeholder="Breed" className="p-2 border rounded" />
          <input type="date" name="birthdate" value={newAnimal.birthdate} onChange={handleChange} className="p-2 border rounded" />
          <input name="weight" value={newAnimal.weight} onChange={handleChange} placeholder="Weight (lbs)" className="p-2 border rounded" />
          <select name="gender" value={newAnimal.gender} onChange={handleChange} className="p-2 border rounded">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknown">Unknown</option>
          </select>
          <select name="locationId" value={newAnimal.locationId} onChange={handleChange} className="p-2 border rounded">
            <option value="">Select Field (Optional)</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        <label className="block mt-4 font-semibold">Select Parent(s) (Optional)</label>
        <select
          multiple
          value={selectedParents}
          onChange={(e) =>
            setSelectedParents([...e.target.selectedOptions].map((o) => o.value))
          }
          className="w-full p-2 border rounded mt-1"
        >
          {livestock.map((animal) => (
            <option key={animal.id} value={animal.id}>
              {animal.name} ({animal.species})
            </option>
          ))}
        </select>

        <button
          onClick={handleAddOrUpdateAnimal}
          className="mt-4 mx-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {editingId ? "Update Animal" : "Add Animal"}
        </button>
        <button className="mt-4 px-4 mx-2 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={() => navigate(-1)}
        >
          Back To Inventory
        </button>
      </div>

      {/* -------- TABLE -------- */}
      <h3 className="text-xl font-semibold mb-2">Current Livestock</h3>
      <ResponsiveLivestockTable
        livestock={livestock}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleViewProfile}
        getParents={getParents}
        getChildren={getChildren}
      />
    </div>
  );
};

export default LivestockManager;
