import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { getUrl } from "aws-amplify/storage";

export default function ExpenseTable({ expenses = [], onDelete }) {
  const navigate = useNavigate();
  const [imageUrls, setImageUrls] = React.useState({});
  // NEW: Track which image URL we're showing in full-size
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
              // Grab the string URL (url.href) for the <img> src
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

  // A simple overlay for the enlarged image
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

  return (
    <>
      {/* Render the overlay if an image is selected */}
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Item</th>
                      <th>Vendor</th>
                      <th>Cost</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Notes</th>
                      <th>Receipt</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenses.map((exp, idx) => (
                      <tr
                        key={exp.id ?? idx}
                        className="hover:bg-blue-50 transition-colors"
                      >
                        <td>{new Date(exp.date).toLocaleDateString()}</td>
                        <td>{exp.category}</td>
                        <td>{exp.item}</td>
                        <td>{exp.vendor}</td>
                        <td>${exp.unitCost}</td>
                        <td>{exp.quantity}</td>
                        <td>${exp.totalCost?.toFixed(2)}</td>
                        <td>{exp.description || ""}</td>

                        {/* Show the receipt thumbnail if we have a URL */}
                        <td className="hover: scale-75">
                          {exp.receiptImageKey ? (
                            imageUrls[exp.id] ? (
                              <img
                                src={imageUrls[exp.id]}
                                alt="Receipt"
                                className="
                                  w-[50px] h-[50px]
                                  object-cover
                                  cursor-pointer
                                  transform
                                  transition
                                  duration-200
                                  hover:scale-110
                                "
                                onClick={() =>
                                  setSelectedImageUrl(imageUrls[exp.id])
                                }
                              />
                            ) : (
                              <span>Loading...</span>
                            )
                          ) : (
                            <span>No receipt</span>
                          )}
                        </td>

                        <td className="flex gap-2">
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
    </>
  );
}
