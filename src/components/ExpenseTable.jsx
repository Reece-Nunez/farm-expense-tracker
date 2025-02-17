import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expense } from "../model/Expense";

export default function ExpenseTable({ expenses = [], onEdit, onDelete }) {
  if (!expenses.length) {
    return null;
  }

  return (
    <Card className="max-w-4xl mx-auto p-4 rounded-xl shadow bg-white mt-6">
      <CardHeader className="text-xl font-bold mb-2">
        Submitted Expenses
      </CardHeader>
      <CardContent>
        <table className="w-full border text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Item</th>
              <th className="p-2 border">Vendor</th>
              <th className="p-2 border">Cost</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, idx) => (
              <tr key={idx}>
                <td className="p-2 border">
                  {new Date(exp.date).toLocaleDateString()}
                </td>
                <td className="p-2 border">{exp.category}</td>
                <td className="p-2 border">{exp.item}</td>
                <td className="p-2 border">{exp.vendor}</td>
                <td className="p-2 border">${exp.unitCost}</td>
                <td className="p-2 border">{exp.quantity}</td>
                <td className="p-2 border">${exp.totalCost.toFixed(2)}</td>
                <td className="p-2 border">{exp.description || ""}</td>
                <td className="p-2 border">
                  <Button
                    onClick={() => onEdit(exp)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(Expense.id)}
                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
