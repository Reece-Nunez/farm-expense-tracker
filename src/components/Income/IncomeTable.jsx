import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";

export default function IncomeTable({ incomes = [], onEdit, onDelete }) {
  const navigate = useNavigate();

  const sortedIncomes = React.useMemo(() => {
    return [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomes]);

  const MobileIncomeCards = () => (
    <div className="block md:hidden space-y-6">
      {sortedIncomes.map((inc) => {
        const dateDisplay = inc.date
          ? new Date(inc.date).toLocaleDateString()
          : "";
        const qty = inc.quantity ?? 0;
        const price = inc.price ?? 0;
        const amount = inc.amount ?? qty * price;

        return (
          <div
            key={inc.id}
            className="bg-white rounded-2xl shadow-md border border-gray-300 p-4 space-y-3 hover:shadow-lg transition duration-300"
          >
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Date</span>
              <span className="font-semibold">{dateDisplay}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Item</span>
              <span className="font-semibold">{inc.item}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Quantity</span>
              <span>{qty}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Price</span>
              <span>${price.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Amount</span>
              <span className="text-green-600 font-bold">${amount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Payment</span>
              <span>{inc.paymentMethod || "-"}</span>
            </div>

            {inc.notes && (
              <div className="text-gray-700 text-sm">
                <span className="block font-medium">Notes</span>
                {inc.notes}
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => onEdit(inc)}
                className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-1 px-3 py-2 rounded-lg"
              >
                <PencilAltIcon className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(inc.id)}
                className="w-full bg-red-500 hover:bg-red-600 flex items-center justify-center gap-1 px-3 py-2 rounded-lg"
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

  const DesktopIncomeTable = () => (
    <div className="hidden md:block space-y-6">
      {sortedIncomes.map((inc) => {
        const dateDisplay = inc.date
          ? new Date(inc.date).toLocaleDateString()
          : "";
        const qty = inc.quantity ?? 0;
        const price = inc.price ?? 0;
        const amount = inc.amount ?? qty * price;

        return (
          <div
            key={inc.id}
            className="bg-white border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6"
          >
            <div className="grid grid-cols-7 gap-4 items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">{dateDisplay}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Item</p>
                <p className="font-semibold">{inc.item}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">Quantity</p>
                <p>{qty}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">Price</p>
                <p>${price.toFixed(2)}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-green-600 font-bold">${amount.toFixed(2)}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">Payment</p>
                <p>{inc.paymentMethod || "-"}</p>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">Notes</p>
                <p>{inc.notes || "-"}</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                onClick={() => onEdit(inc)}
                className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 px-4 py-2 rounded-lg"
              >
                <PencilAltIcon className="w-4 h-4" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(inc.id)}
                className="bg-red-500 hover:bg-red-600 flex items-center gap-1 px-4 py-2 rounded-lg"
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

  return (
    <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg border border-gray-200 rounded-2xl bg-white">
      <CardHeader className="text-3xl font-bold text-center mb-8 text-green-700">
        Submitted Income
      </CardHeader>
      <CardContent>
        {sortedIncomes.length ? (
          <>
            <MobileIncomeCards />

            <DesktopIncomeTable />

            <div className="flex justify-center mt-10">
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
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <p className="text-lg text-gray-700">No income records found.</p>
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
