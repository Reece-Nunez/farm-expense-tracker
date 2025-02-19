// IncomeTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function IncomeTable({ incomes = [], onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="max-w-4xl mx-auto p-4 rounded-xl shadow bg-white mt-6">
      <CardHeader className="text-xl font-bold mb-2">
        Submitted Income
      </CardHeader>
      <CardContent>
        {incomes.length ? (
          <>
            <table className="w-full border text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Item</th>
                  <th className="p-2 border">Amount</th>
                  <th className="p-2 border">Payment Method</th>
                  <th className="p-2 border">Notes</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {incomes.map((inc, idx) => (
                  <tr key={inc.id ?? idx}>
                    <td className="p-2 border">
                      {new Date(inc.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">{inc.item}</td>
                    <td className="p-2 border">${inc.amount.toFixed(2)}</td>
                    <td className="p-2 border">{inc.paymentMethod || "-"}</td>
                    <td className="p-2 border">{inc.description || ""}</td>
                    <td className="p-2 border flex gap-2">
                      <Button
                        onClick={() => onEdit(inc)}
                        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDelete(inc.id)}
                        className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center m-6">
              <Button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Back to Dashboard
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="mb-4">No income records found.</p>
            <Button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
