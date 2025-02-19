// IncomeTable.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

export default function IncomeTable({ incomes = [], onEdit, onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg">
      <CardHeader className="text-2xl font-bold text-center mb-4">
        Submitted Income
      </CardHeader>
      <CardContent>
        {incomes.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Payment Method
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Notes
                    </th>
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {incomes.map((inc, idx) => (
                    <tr
                      key={inc.id ?? idx}
                      className="hover:bg-green-50 transition-colors"
                    >
                      <td className="px-4 py-2">
                        {new Date(inc.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{inc.item}</td>
                      <td className="px-4 py-2">${inc.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{inc.paymentMethod || "-"}</td>
                      <td className="px-4 py-2">{inc.description || ""}</td>
                      <td className="px-4 py-2 flex justify-center gap-2">
                        <Button
                          onClick={() => onEdit(inc)}
                          className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 px-3 py-1 rounded"
                        >
                          <PencilAltIcon className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => onDelete(inc.id)}
                          className="bg-red-500 hover:bg-red-600 flex items-center gap-1 px-3 py-1 rounded"
                        >
                          <TrashIcon className="w-4 h-4" />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center mt-6">
              <Button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-gray-700">No income records found.</p>
            <Button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
