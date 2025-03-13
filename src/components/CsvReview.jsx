import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const allowedCategories = [
  "Chemicals", "Conservation Expenses", "Custom Hire",
  "Feed Purchased", "Fertilizers and Lime", "Freight and Trucking",
  "Gasoline, Fuel, and Oil", "Mortgage Interest", "Insurance (Not Health)",
  "Other Interest", "Equipment Rental", "Farm Equipment", "Other Rental",
  "Repairs and Maintenance", "Seeds and Plants", "Storage and Warehousing",
  "Supplies Purchased", "Taxes", "Utilities", "Vet", "Breeding", "Medicine",
];

export default function CsvReview({ mappedData, onSubmit, onBack }) {
  const [rows, setRows] = useState(mappedData);

  const updateRowField = (index, field, value) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };
    setRows(newRows);
  };

  const validateRows = () => {
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.date || !r.category || !r.item || !r.vendor || !r.cost || !r.quantity) {
        toast.error(`Row ${i + 1} is missing a required field.`);
        return false;
      }
      if (!allowedCategories.includes(r.category)) {
        toast.error(`Invalid category in Row ${i + 1}: ${r.category}`);
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    if (!validateRows()) return;
    onSubmit(rows);
  };

  return (
    <div className="p-4 bg-white border rounded shadow">
      <h2 className="text-xl font-semibold">Review Line Items</h2>
      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Vendor</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">Cost</th>
              <th className="border p-2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="border p-2"><Input type="date" value={row.date} onChange={(e) => updateRowField(idx, "date", e.target.value)} /></td>
                <td className="border p-2"><Input value={row.vendor} onChange={(e) => updateRowField(idx, "vendor", e.target.value)} /></td>
                <td className="border p-2"><Select value={row.category} onChange={(e) => updateRowField(idx, "category", e.target.value)}>
                  {allowedCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </Select></td>
                <td className="border p-2"><Input value={row.item} onChange={(e) => updateRowField(idx, "item", e.target.value)} /></td>
                <td className="border p-2"><Input value={row.cost} onChange={(e) => updateRowField(idx, "cost", e.target.value)} /></td>
                <td className="border p-2"><Input type="number" value={row.quantity} onChange={(e) => updateRowField(idx, "quantity", e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-6">
        <Button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">
          Back
        </Button>
        <Button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Line Items
        </Button>
      </div>
    </div>
  );
}
