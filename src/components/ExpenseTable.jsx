import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { getUrl } from "aws-amplify/storage";

export default function ExpenseTable({ expenses = [], onDelete }) {
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = React.useState({});
  const [selectedImageUrl, setSelectedImageUrl] = React.useState(null);

  // Fetch receipt image URLs
  React.useEffect(() => {
    let isMounted = true;

    async function fetchImages() {
      const newImageUrls = {};
      for (const exp of expenses) {
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
  }, [expenses]);

  // Overlay for viewing full-size receipt images
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
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold mb-1">{expense.vendor || "Unknown Vendor"}</h3>
            <p className="text-gray-500 text-sm">{new Date(expense.date).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-700 font-semibold">Grand Total:</p>
            <p className="text-2xl text-green-600 font-bold">${(expense.grandTotal ?? 0).toFixed(2)}</p>
          </div>
        </div>

        {expense.description && (
          <p className="text-gray-600 mb-4 italic">Notes: {expense.description}</p>
        )}

        {expense.receiptImageKey && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Receipt:</p>
            {receiptUrl ? (
              <img
                src={receiptUrl}
                alt="Receipt"
                className="w-32 h-32 object-cover rounded cursor-pointer border"
                onClick={() => setSelectedImageUrl(receiptUrl)}
              />
            ) : (
              <span className="text-gray-400">Loading...</span>
            )}
          </div>
        )}

        <div className="mt-4">
          <h4 className="font-semibold text-gray-800 mb-2">Line Items:</h4>
          <div className="space-y-2">
            {expense.lineItems && expense.lineItems.length > 0 ? (
              expense.lineItems.map((li, index) => (
                <div key={index} className="border rounded-md p-3 bg-gray-50">
                  <div className="flex justify-between">
                    <p><span className="font-semibold">Item:</span> {li.item}</p>
                    <p><span className="font-semibold">Category:</span> {li.category}</p>
                  </div>
                  <div className="flex justify-between mt-1">
                    <p><span className="font-semibold">Unit Cost:</span> ${parseFloat(li.unitCost ?? 0).toFixed(2)}</p>
                    <p><span className="font-semibold">Quantity:</span> {li.quantity}</p>
                    <p><span className="font-semibold">Line Total:</span> ${parseFloat(li.lineTotal ?? 0).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No line items available.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            onClick={() => navigate(`/edit-expense/${expense.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex gap-2"
          >
            <PencilAltIcon className="h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={() => onDelete(expense.id)}
            className="bg-red-500 hover:bg-red-600 text-white flex gap-2"
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

      <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg">
        <CardHeader className="text-2xl font-bold text-center mb-6">
          Submitted Expenses
        </CardHeader>
        <CardContent>
          {expenses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {expenses.map((exp) => (
                  <ExpenseCard key={exp.id} expense={exp} />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
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
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
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
