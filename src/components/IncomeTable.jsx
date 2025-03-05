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
                    {/* 1) Date */}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    {/* 2) Item */}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Item
                    </th>
                    {/* 3) Quantity */}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Quantity
                    </th>
                    {/* 4) Price */}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>
                    {/* 5) Amount (quantity * price) */}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Amount
                    </th>
                    {/* 6) Payment Method */}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Payment Method
                    </th>
                    {/* 7) Notes */}
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                      Notes
                    </th>
                    {/* 8) Actions */}
                    <th className="px-4 py-2 text-center text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {incomes.map((inc) => {
                    // If you store quantity/price directly, we can do:
                    //   inc.quantity
                    //   inc.price
                    // Otherwise, if you only store amount, skip these columns
                    const dateDisplay = inc.date
                      ? new Date(inc.date).toLocaleDateString()
                      : "";
                    const qty = inc.quantity ?? 0;
                    const price = inc.price ?? 0;
                    const amount = inc.amount ?? qty * price;

                    return (
                      <tr
                        key={inc.id}
                        className="hover:bg-green-50 transition-colors"
                      >
                        {/* Date */}
                        <td className="px-4 py-2">{dateDisplay}</td>
                        {/* Item */}
                        <td className="px-4 py-2">{inc.item}</td>
                        {/* Quantity */}
                        <td className="px-4 py-2">{inc.quantity ?? 0}</td>
                        {/* Price */}
                        <td className="px-4 py-2">
                          {inc.price ? `$${inc.price.toFixed(2)}` : "$0.00"}
                        </td>
                        {/* Amount */}
                        <td className="px-4 py-2">
                          ${inc.amount?.toFixed(2) || "0.00"}
                        </td>
                        {/* Payment Method */}
                        <td className="px-4 py-2">
                          {inc.paymentMethod || "-"}
                        </td>
                        {/* Notes */}
                        <td className="px-4 py-2">{inc.notes || ""}</td>
                        {/* Actions */}
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
                    );
                  })}
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
