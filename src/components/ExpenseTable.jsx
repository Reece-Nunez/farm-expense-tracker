import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

export default function ExpenseTable({ expenses = [], onDelete }) {
  const navigate = useNavigate();

  return (
    <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg">
      <CardHeader className="text-2xl font-bold text-center mb-4">
        Submitted Expenses
      </CardHeader>
      <CardContent>
        {expenses.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Item
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Vendor
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Cost
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Total
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
                  {expenses.map((exp, idx) => (
                    <tr
                      key={exp.id ?? idx}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      <td className="px-4 py-2">
                        {new Date(exp.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{exp.category}</td>
                      <td className="px-4 py-2">{exp.item}</td>
                      <td className="px-4 py-2">{exp.vendor}</td>
                      <td className="px-4 py-2">${exp.unitCost}</td>
                      <td className="px-4 py-2">{exp.quantity}</td>
                      <td className="px-4 py-2">
                        ${exp.totalCost?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2">{exp.description || ""}</td>
                      <td className="px-4 py-2 flex justify-center gap-2">
                        <Button
                          onClick={() => navigate(`/edit-expense/${exp.id}`)}
                          className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 px-3 py-1 rounded"
                        >
                          <PencilAltIcon className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => onDelete(exp.id)}
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
            <p className="mb-4 text-gray-700">No expenses found.</p>
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
