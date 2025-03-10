import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

export default function IncomeTable({ incomes = [], onEdit, onDelete }) {
  const navigate = useNavigate();

  // MOBILE layout (cards) for screens < md
  const MobileIncomeCards = () => (
    <div className="block md:hidden">
      {incomes.map((inc) => {
        const dateDisplay = inc.date
          ? new Date(inc.date).toLocaleDateString()
          : "";
        const qty = inc.quantity ?? 0;
        const price = inc.price ?? 0;
        const amount = inc.amount ?? qty * price;

        return (
          <div
            key={inc.id}
            className="bg-white shadow rounded mb-4 p-4 border"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Date:</span>
              <span>{dateDisplay}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Item:</span>
              <span>{inc.item}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Quantity:</span>
              <span>{qty}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Price:</span>
              <span>{price ? `$${price.toFixed(2)}` : "$0.00"}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Amount:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Payment Method:</span>
              <span>{inc.paymentMethod || "-"}</span>
            </div>
            {inc.notes && (
              <div className="mb-2">
                <span className="font-semibold">Notes:</span> {inc.notes}
              </div>
            )}
            {/* Actions */}
            <div className="flex gap-2 mt-2">
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
            </div>
          </div>
        );
      })}
    </div>
  );

  // DESKTOP layout (table) for screens >= md
  const DesktopIncomeTable = () => (
    <div className="hidden md:block overflow-x-auto">
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
              Quantity
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Price
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
          {incomes.map((inc) => {
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
                <td className="px-4 py-2">{dateDisplay}</td>
                <td className="px-4 py-2">{inc.item}</td>
                <td className="px-4 py-2">{qty}</td>
                <td className="px-4 py-2">
                  {price ? `$${price.toFixed(2)}` : "$0.00"}
                </td>
                <td className="px-4 py-2">${amount.toFixed(2)}</td>
                <td className="px-4 py-2">{inc.paymentMethod || "-"}</td>
                <td className="px-4 py-2">{inc.notes || ""}</td>
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
  );

  return (
    <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg">
      <CardHeader className="text-2xl font-bold text-center mb-4">
        Submitted Income
      </CardHeader>
      <CardContent>
        {incomes.length ? (
          <>
            {/* Mobile layout (cards) */}
            <MobileIncomeCards />

            {/* Desktop layout (table) */}
            <DesktopIncomeTable />

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
