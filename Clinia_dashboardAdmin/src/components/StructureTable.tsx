import React from "react";

const StructureTable = () => {
  const structures = [
    { name: "Clinique A", description: "Une clinique privée", status: "Pending" },
    { name: "Hôpital B", description: "Un hôpital général", status: "Pending" },
    // Add more entries as needed
  ];

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Structures de santé</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {structures.map((structure, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{structure.name}</td>
              <td className="p-2 border">{structure.description}</td>
              <td className="p-2 border flex space-x-2">
                <button className="bg-green-500 text-white px-4 py-1 rounded">
                  Approuver
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded">
                  Rejeter
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StructureTable;
