import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { listIncomesWithLivestock } from "@/graphql/customQueries";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "../../utils/getCurrentUser";
import { haptics } from "../../utils/haptics";
import { MobileLoader } from "../ui/MobileLoader";

export default function IncomeTable({ onEdit, onDelete }) {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const client = generateClient();
        const user = await getCurrentUser();

        const { data } = await client.graphql({
          query: listIncomesWithLivestock,
          variables: {
            filter: { sub: { eq: user.sub } },
            limit: 1000,
          },
        });

        const incomeItems = data?.listIncomes?.items || [];
        setIncomes(incomeItems);
      } catch (err) {
        console.error("Failed to fetch incomes:", err);
      }
    };

    fetchIncome();
  }, []);

  const sortedIncomes = useMemo(() => {
    const sorted = [...incomes].sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case "item":
          aVal = a.item?.toLowerCase() || "";
          bVal = b.item?.toLowerCase() || "";
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "amount":
          const aAmt = a.amount ?? (a.quantity ?? 0) * (a.price ?? 0);
          const bAmt = b.amount ?? (b.quantity ?? 0) * (b.price ?? 0);
          return sortDirection === "asc" ? aAmt - bAmt : bAmt - aAmt;
        case "paymentMethod":
          aVal = a.paymentMethod?.toLowerCase() || "";
          bVal = b.paymentMethod?.toLowerCase() || "";
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "date":
        default:
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
    });

    return sorted;
  }, [incomes, sortField, sortDirection]);

  return (
    <div className="px-3 sm:px-0">
      <Card className="max-w-7xl mx-auto p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg border border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800">
        <CardHeader className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-4 sm:mb-6 lg:mb-8 text-green-700 dark:text-green-400">
          Submitted Income
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white w-full sm:w-auto touch-manipulation"
                value={sortField}
                onChange={(e) => {
                  haptics.light();
                  setSortField(e.target.value);
                }}
              >
                <option value="date">Date</option>
                <option value="item">Item</option>
                <option value="amount">Amount</option>
                <option value="paymentMethod">Payment</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Direction:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 dark:text-white w-full sm:w-auto touch-manipulation"
                value={sortDirection}
                onChange={(e) => {
                  haptics.light();
                  setSortDirection(e.target.value);
                }}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

        {sortedIncomes.length ? (
          <div className="space-y-4 sm:space-y-6">
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
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-6 space-y-3 sm:space-y-4 touch-manipulation"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="col-span-2">
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-xs">📅 Date</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-base">{dateDisplay}</p>
                    </div>

                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-xs">🛒 Item</p>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 break-words">{inc.item}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium text-xs">💰 Total</p>
                      <p className="font-bold text-green-600 text-lg">
                        ${amount.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-500 font-medium text-xs">📦 Qty</p>
                      <p className="text-sm">{qty}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium text-xs">💲/Unit</p>
                      <p className="text-sm">${price.toFixed(2)}</p>
                    </div>

                    <div>
                      <p className="text-gray-500 font-medium text-xs">💳 Payment</p>
                      <p className="text-sm">{inc.paymentMethod || "-"}</p>
                    </div>
                    <div></div>

                    {inc.livestock && (
                      <div className="col-span-2">
                        <p className="text-gray-500 font-medium text-xs">🐮 Animal Sold</p>
                        <p className="text-purple-700 font-semibold">
                          {inc.livestock.name} ({inc.livestock.species})
                        </p>
                      </div>
                    )}

                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium text-xs">📝 Notes</p>
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">
                        {inc.notes || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-600">
                    <Button
                      onClick={() => {
                        haptics.light();
                        onEdit({
                          ...inc,
                          date: inc.date ? new Date(inc.date) : null,
                          weightOrQuantity: inc.quantity,
                          pricePerUnit: inc.price,
                        });
                      }}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 text-white px-4 py-3 rounded-lg w-full sm:w-auto touch-manipulation"
                    >
                      <PencilAltIcon className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => {
                        haptics.medium();
                        onDelete(inc.id);
                      }}
                      className="bg-red-500 hover:bg-red-600 flex items-center justify-center gap-2 text-white px-4 py-3 rounded-lg w-full sm:w-auto touch-manipulation"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-center gap-4 mt-10">
              <Button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
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
    </div>
  );
}
