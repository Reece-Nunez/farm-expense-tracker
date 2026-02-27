import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import { deleteExpense as deleteExpenseMutation } from "@/graphql/mutations";
import { listLineItems } from "@/graphql/queries";
import { toast } from "react-hot-toast";

export default function ExpenseTable({ expenses = [], onDelete }) {
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = React.useState({});
  const [selectedImageUrl, setSelectedImageUrl] = React.useState(null);
  const [mergedExpenses, setMergedExpenses] = React.useState([]);
  const client = generateClient();
  const [sortField, setSortField] = React.useState("date");
  const [sortDirection, setSortDirection] = React.useState("desc");


  const sortedExpenses = React.useMemo(() => {
    const sorted = [...mergedExpenses].sort((a, b) => {
      let aVal, bVal;

      switch (sortField) {
        case "vendor":
          aVal = a.vendor?.toLowerCase() || "";
          bVal = b.vendor?.toLowerCase() || "";
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        case "grandTotal":
          aVal = parseFloat(a.grandTotal ?? 0);
          bVal = parseFloat(b.grandTotal ?? 0);
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        case "date":
        default:
          aVal = new Date(a.date);
          bVal = new Date(b.date);
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
    });

    return sorted;
  }, [mergedExpenses, sortField, sortDirection]);


  React.useEffect(() => {
    if (!expenses.length) return;

    const fetchLineItemsAndMerge = async () => {
      try {
        const { data } = await client.graphql({ query: listLineItems });
        const allLineItems = data.listLineItems.items;

        const grouped = allLineItems.reduce((acc, item) => {
          if (!acc[item.expenseID]) acc[item.expenseID] = [];
          acc[item.expenseID].push(item);
          return acc;
        }, {});

        const enriched = expenses.map((exp) => ({
          ...exp,
          lineItems: { items: grouped[exp.id] || [] },
        }));

        setMergedExpenses(enriched);
      } catch (err) {
        console.error("Error fetching line items:", err);
      }
    };

    fetchLineItemsAndMerge();
  }, [expenses]);

  React.useEffect(() => {
    let isMounted = true;

    async function fetchImages() {
      const newImageUrls = {};
      for (const exp of mergedExpenses) {
        if (exp.receiptImageKey) {
          try {
            const { url } = await getUrl({ path: exp.receiptImageKey });
            if (isMounted) {
              newImageUrls[exp.id] = url.href;
            }
          } catch (error) {
            console.error("Error fetching image for expense:", exp.id, error);
          }
        }
      }
      if (isMounted) {
        setImageUrls(newImageUrls);
      }
    }

    fetchImages();
    return () => {
      isMounted = false;
    };
  }, [mergedExpenses]);

  const handleDelete = async (expenseId) => {
    try {
      const { data } = await client.graphql({
        query: listLineItems,
        variables: {
          filter: { expenseID: { eq: expenseId } },
          limit: 1000,
        },
      });

      const lineItems = data?.listLineItems?.items || [];

      await Promise.all(
        lineItems.map((li) =>
          client.graphql({
            query: /* GraphQL */ `
              mutation DeleteLineItem($input: DeleteLineItemInput!) {
                deleteLineItem(input: $input) {
                  id
                }
              }
            `,
            variables: {
              input: { id: li.id },
            },
          })
        )
      );

      await client.graphql({
        query: /* GraphQL */ `
          mutation DeleteExpense($input: DeleteExpenseInput!) {
            deleteExpense(input: $input) {
              id
            }
          }
        `,
        variables: { input: { id: expenseId } },
      });

      if (onDelete) onDelete(expenseId);
      toast.success("Expense and its line items deleted.");
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("Failed to delete expense.");
    }
  };

  const FullSizeImageOverlay = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;
    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <img
          src={imageUrl}
          alt="Full Receipt"
          className="max-w-full max-h-full rounded shadow-lg"
        />
      </div>
    );
  };

  const ExpenseCard = ({ expense }) => {
    const receiptUrl = imageUrls[expense.id];

    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200 dark:border-gray-600 hover:shadow-2xl transition-shadow duration-300 touch-manipulation">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold mb-1 text-gray-800 dark:text-gray-200">
              {expense.vendor || "Unknown Vendor"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Grand Total:</p>
            <p className="text-xl sm:text-2xl text-green-600 font-bold">
              ${(expense.grandTotal ?? 0).toFixed(2)}
            </p>
          </div>
        </div>

        {expense.description && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-xs mb-1">Notes</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm italic">
              {expense.description}
            </p>
          </div>
        )}

        {expense.receiptImageKey && (
          <div className="mb-4">
            <p className="text-gray-500 dark:text-gray-400 font-medium text-xs mb-2">Receipt</p>
            {receiptUrl ? (
              <img
                src={receiptUrl}
                alt="Receipt"
                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600 touch-manipulation"
                onClick={() => setSelectedImageUrl(receiptUrl)}
              />
            ) : (
              <span className="text-gray-400 text-sm">Loading...</span>
            )}
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-sm sm:text-base">Line Items</h4>
          <div className="space-y-2 sm:space-y-3">
            {[
              ...new Map(
                expense.lineItems.items.map((li) => [li.id, li])
              ).values(),
            ].map((li, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700 shadow-sm"
              >
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <div className="col-span-2">
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">Item</p>
                    <p className="font-semibold text-sm">{li.item}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">Category</p>
                    <p className="text-sm">{li.category}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">Total</p>
                    <p className="text-sm font-bold text-green-600">${parseFloat(li.lineTotal ?? 0).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">Qty</p>
                    <p className="text-sm">{li.quantity}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500 dark:text-gray-400 text-xs">Unit Cost</p>
                    <p className="text-sm">${parseFloat(li.unitCost ?? 0).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button
            onClick={() => {
              haptics.light();
              navigate(`/dashboard/edit-expense/${expense.id}`);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 w-full sm:w-auto touch-manipulation"
          >
            <PencilAltIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={() => {
              haptics.medium();
              if (window.confirm('Are you sure you want to delete this expense?')) {
                onDelete?.(expense.id);
              }
            }}
            className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-2 w-full sm:w-auto touch-manipulation"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    );
  };

  return (
    <>
      <FullSizeImageOverlay
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />

      <Card className="max-w-7xl mx-auto p-3 sm:p-6 mb-6 shadow-lg border border-gray-200 dark:border-gray-600 rounded-2xl bg-white dark:bg-gray-800">
        <CardHeader className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-green-700 dark:text-green-400">
          Submitted Expenses
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-3 text-base bg-white dark:bg-gray-700 dark:text-white w-full sm:w-auto touch-manipulation"
                value={sortField}
                onChange={(e) => {
                  haptics.light();
                  setSortField(e.target.value);
                }}
              >
                <option value="date">Date</option>
                <option value="vendor">Vendor</option>
                <option value="grandTotal">Amount</option>
              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Direction:</label>
              <select
                className="border border-gray-300 dark:border-gray-600 rounded px-3 py-3 text-base bg-white dark:bg-gray-700 dark:text-white w-full sm:w-auto touch-manipulation"
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

          {sortedExpenses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {sortedExpenses.map((exp) => (
                  <ExpenseCard key={exp.id} expense={exp} />
                ))}
              </div>

              <div className="flex justify-center mt-6 sm:mt-8">
                <Button
                  type="button"
                  onClick={() => {
                    haptics.light();
                    navigate("/dashboard");
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg w-full sm:w-auto touch-manipulation"
                >
                  Back to Dashboard
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-300">No expenses found.</p>
              <Button
                type="button"
                onClick={() => {
                  haptics.light();
                  navigate("/dashboard");
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg w-full sm:w-auto touch-manipulation"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
