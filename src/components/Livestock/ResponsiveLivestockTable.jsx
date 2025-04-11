import React from "react";

const ResponsiveLivestockTable = ({ livestock, onEdit, onDelete, onView, getParents, getChildren }) => {
  return (
    <div className="w-full">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Species</th>
              <th className="px-4 py-2 border">Breed</th>
              <th className="px-4 py-2 border">Birthdate</th>
              <th className="px-4 py-2 border">Age</th>
              <th className="px-4 py-2 border">Weight</th>
              <th className="px-4 py-2 border">Field</th>
              <th className="px-4 py-2 border">Parents</th>
              <th className="px-4 py-2 border">Offspring</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {livestock.map((animal) => (
              <tr key={animal.id} className="text-center">
                <td className="border px-4 py-2">{animal.name}</td>
                <td className="border px-4 py-2">{animal.species}</td>
                <td className="border px-4 py-2">{animal.breed}</td>
                <td className="border px-4 py-2">{animal.birthdate}</td>
                <td className="border px-4 py-2">{animal.age}</td>
                <td className="border px-4 py-2">
                  {isNaN(animal.weight) ? "-" : animal.weight}
                </td>
                <td className="border px-4 py-2">{animal.location?.name || "-"}</td>
                <td className="border px-4 py-2">{getParents(animal.id)}</td>
                <td className="border px-4 py-2">{getChildren(animal.id)}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => onEdit(animal)} className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                  <button onClick={() => onDelete(animal.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                  <button onClick={() => onView(animal.id)} className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {livestock.map((animal) => (
          <div key={animal.id} className="border rounded-lg p-4 shadow-md bg-white">
            <p><strong>Name:</strong> {animal.name}</p>
            <p><strong>Species:</strong> {animal.species}</p>
            <p><strong>Breed:</strong> {animal.breed}</p>
            <p><strong>Birthdate:</strong> {animal.birthdate}</p>
            <p><strong>Weight:</strong> {animal.weight ?? "-"}</p>
            <p><strong>Field:</strong> {animal.location?.name || "-"}</p>
            <p><strong>Parents:</strong> {getParents(animal.id)}</p>
            <p><strong>Offspring:</strong> {getChildren(animal.id)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => onEdit(animal)} className="flex-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
              <button onClick={() => onDelete(animal.id)} className="flex-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
              <button onClick={() => onView(animal.id)} className="flex-1 px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveLivestockTable;
