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

  React.useEffect(() => {
    let isMounted = true;

    async function fetchImages() {
      const newImageUrls = {};
      for (const exp of expenses) {
        if (exp.receiptImageKey) {
          try {
            // getUrl returns { url: URL, expiresAt: Date }
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

  // Overlay for the enlarged image
  const FullSizeImageOverlay = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null; // no overlay if no image selected

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <img
          src={imageUrl}
          alt="Full Receipt"
          className="max-w-full max-h-full"
        />
      </div>
    );
  };

  // MOBILE layout (cards) for screens < md
  const MobileExpenseCards = () => (
    <div className="block md:hidden">
      {expenses.map((exp, idx) => {
        const receiptUrl = imageUrls[exp.id];
        return (
          <div
            key={exp.id ?? idx}
            className="bg-white shadow rounded mb-4 p-4 border"
          >
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Date:</span>
              <span>{new Date(exp.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Category:</span>
              <span>{exp.category}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Item:</span>
              <span>{exp.item}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Vendor:</span>
              <span>{exp.vendor}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Cost:</span>
              <span>${exp.unitCost}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Quantity:</span>
              <span>{exp.quantity}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Total:</span>
              <span>${exp.totalCost?.toFixed(2)}</span>
            </div>
            {exp.description && (
              <div className="mb-2">
                <span className="font-semibold">Notes:</span>{" "}
                <span>{exp.description}</span>
              </div>
            )}
            {/* Receipt Image */}
            <div className="mb-4">
              <span className="font-semibold">Receipt:</span>{" "}
              {exp.receiptImageKey ? (
                receiptUrl ? (
                  <img
                    src={receiptUrl}
                    alt="Receipt"
                    className="w-20 h-20 object-cover cursor-pointer mt-2"
                    onClick={() => setSelectedImageUrl(receiptUrl)}
                  />
                ) : (
                  <span>Loading...</span>
                )
              ) : (
                <span>No receipt</span>
              )}
            </div>
            {/* Actions */}
            <div className="flex gap-2 mt-2">
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
            </div>
          </div>
        );
      })}
    </div>
  );

  // DESKTOP layout (table) for screens >= md
  const DesktopExpenseTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Category</th>
            <th className="p-2">Item</th>
            <th className="p-2">Vendor</th>
            <th className="p-2">Cost</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Total</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Receipt</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {expenses.map((exp, idx) => {
            const receiptUrl = imageUrls[exp.id];
            return (
              <tr
                key={exp.id ?? idx}
                className="hover:bg-blue-50 transition-colors"
              >
                <td className="p-2">{new Date(exp.date).toLocaleDateString()}</td>
                <td className="p-2">{exp.category}</td>
                <td className="p-2">{exp.item}</td>
                <td className="p-2">{exp.vendor}</td>
                <td className="p-2">${exp.unitCost}</td>
                <td className="p-2">{exp.quantity}</td>
                <td className="p-2">${exp.totalCost?.toFixed(2)}</td>
                <td className="p-2">{exp.description || ""}</td>
                {/* Receipt thumbnail */}
                <td className="p-2">
                  {exp.receiptImageKey ? (
                    receiptUrl ? (
                      <img
                        src={receiptUrl}
                        alt="Receipt"
                        className="w-[50px] h-[50px] object-cover cursor-pointer transform transition duration-200 hover:scale-110"
                        onClick={() => setSelectedImageUrl(receiptUrl)}
                      />
                    ) : (
                      <span>Loading...</span>
                    )
                  ) : (
                    <span>No receipt</span>
                  )}
                </td>
                <td className="p-2">
                  <div className="flex gap-2">
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
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {/* Full-size overlay if an image is selected */}
      <FullSizeImageOverlay
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />

      <Card className="max-w-7xl mx-auto p-6 mb-6 shadow-lg">
        <CardHeader className="text-2xl font-bold text-center mb-4">
          Submitted Expenses
        </CardHeader>
        <CardContent>
          {expenses.length ? (
            <>
              {/* Mobile layout (cards) */}
              <MobileExpenseCards />

              {/* Desktop layout (table) */}
              <DesktopExpenseTable />

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
    </>
  );
}
