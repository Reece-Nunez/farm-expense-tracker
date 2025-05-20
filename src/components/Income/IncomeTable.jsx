import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { listIncomesWithLivestock } from "@/graphql/customQueries";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "../../utils/getCurrentUser";

export default function IncomeTable({ onEdit, onDelete }) {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);

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
    return [...incomes].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [incomes]);

  return (
    <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg border border-gray-200 rounded-2xl bg-white">
      <CardHeader className="text-3xl font-bold text-center mb-8 text-green-700">
        Submitted Income
      </CardHeader>
      <CardContent>
        {sortedIncomes.length ? (
          <div className="space-y-6">
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
                  className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-6 space-y-4"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm sm:text-base">
                    <div>
                      <p className="text-gray-500 font-medium">📅 Date</p>
                      <p className="font-semibold">{dateDisplay}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">🛒 Item</p>
                      <p className="font-semibold">{inc.item}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">📦 Quantity</p>
                      <p>{qty}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">💲Price/Unit</p>
                      <p>${price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">💰 Total</p>
                      <p className="font-bold text-green-600">
                        ${amount.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">💳 Payment</p>
                      <p>{inc.paymentMethod || "-"}</p>
                    </div>

                    {inc.livestock && (
                      <div>
                        <p className="text-gray-500 font-medium">🐮 Animal Sold</p>
                        <p className="text-purple-700 font-semibold">
                          {inc.livestock.name} ({inc.livestock.species})
                        </p>
                      </div>
                    )}

                    <div className="col-span-full">
                      <p className="text-gray-500 font-medium">📝 Notes</p>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {inc.notes || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-end pt-4">
                    <Button
                      onClick={() =>
                        onEdit({
                          ...inc,
                          date: inc.date ? new Date(inc.date) : null,
                          weightOrQuantity: inc.quantity,
                          pricePerUnit: inc.price,
                        })
                      }
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 text-white px-4 py-2 rounded-lg"
                    >
                      <PencilAltIcon className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => onDelete(inc.id)}
                      className="bg-red-500 hover:bg-red-600 flex items-center gap-2 text-white px-4 py-2 rounded-lg"
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
  );
}
