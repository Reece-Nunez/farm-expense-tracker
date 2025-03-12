import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

// Allowed payment methods for income records (for example)
const allowedPaymentMethods = ["Venmo", "Checks", "Cash", "Other"];

// In this review component, we expect the mapped data to include: date, item, quantity, price, paymentMethod, and notes.
export default function CsvReviewIncome({ mappedData, onSubmit, onBack }) {
    const [rows, setRows] = useState(mappedData);

    const updateRowField = (index, field, value) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    // Validate each row has all required fields
    const validateRows = () => {
        for (let i = 0; i < rows.length; i++) {
            const r = rows[i];
            if (!r.date || !r.item || !r.quantity || !r.price || !r.paymentMethod) {
                toast.error(`Row ${i + 1} is missing a required field.`);
                return false;
            }
            if (!allowedPaymentMethods.includes(r.paymentMethod)) {
                toast.error(`Row ${i + 1} has an invalid payment method: ${r.paymentMethod}`);
                return false;
            }
        }
        return true;
    };

    const handleSave = () => {
        if (!validateRows()) return;
        // Convert quantity and price to numbers and compute amount.
        const finalRows = rows.map((row) => {
            const qty = parseInt(row.quantity, 10) || 0;
            const price = parseFloat((row.price || "").replace(/[$,]/g, "")) || 0;
            return {
                ...row,
                quantity: qty,
                price: price,
                amount: qty * price,
            };
        });
        onSubmit(finalRows);
    };

    return (
        <div className="max-w-4xl mx-auto p-4 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-4">Review & Edit CSV Data</h2>
            <p className="text-sm text-gray-500 mb-2">
                Please fix any invalid or missing fields, then click "Save Imported Income."
            </p>
            <div className="overflow-x-auto border rounded">
                <table className="min-w-full border-collapse text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-2">Date</th>
                            <th className="border p-2">Item</th>
                            <th className="border p-2">Quantity</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Payment Method</th>
                            <th className="border p-2">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx}>
                                <td className="border p-2">
                                    <Input
                                        type="date"
                                        value={row.date || ""}
                                        onChange={(e) => updateRowField(idx, "date", e.target.value)}
                                    />
                                </td>
                                <td className="border p-2">
                                    <Input
                                        type="text"
                                        value={row.item || ""}
                                        onChange={(e) => updateRowField(idx, "item", e.target.value)}
                                    />
                                </td>
                                <td className="border p-2">
                                    <Input
                                        type="number"
                                        value={row.quantity || ""}
                                        onChange={(e) => updateRowField(idx, "quantity", e.target.value)}
                                    />
                                </td>
                                <td className="border p-2">
                                    <Input
                                        type="text"
                                        value={row.price || ""}
                                        onChange={(e) => updateRowField(idx, "price", e.target.value)}
                                    />
                                </td>
                                <td className="border p-2">
                                    <Select
                                        value={row.paymentMethod || ""}
                                        onChange={(e) => updateRowField(idx, "paymentMethod", e.target.value)}
                                    >
                                        <option value="">-- Select --</option>
                                        {allowedPaymentMethods.map((pm) => (
                                            <option key={pm} value={pm}>
                                                {pm}
                                            </option>
                                        ))}
                                    </Select>
                                </td>
                                <td className="border p-2">
                                    <Input
                                        type="text"
                                        value={row.notes || ""}
                                        onChange={(e) => updateRowField(idx, "notes", e.target.value)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4 flex justify-between">
                <Button onClick={onBack} className="bg-gray-600 text-white px-4 py-2 rounded">Back</Button>

                <Button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save Imported Income
                </Button>
            </div>
        </div>
    );
}
