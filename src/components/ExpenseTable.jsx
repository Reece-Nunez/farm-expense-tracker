import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { getUrl } from "aws-amplify/storage";


/**
 * 
 * @param {Object} props
 * @param {Array} props.expenses - array of Expenses, each with { date, vendor, grandTotal, receiptImageKey, lineItems[] }
 * @param {Function} props.onDelete - callback when deleting an expense
 */
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

  // Overlay for the enlarged image
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
          className="max-w-full max-h-full"
        />
      </div>
    );
  };

  /** 
   * MOBILE layout (cards) for screens < md
   */
  const MobileExpenseCards = () => (
    <div className="block md:hidden">
      {expenses.map((exp) => {
        const receiptUrl = imageUrls[exp.id];
        return (
          <div
            key={exp.id}
            className="bg-white shadow rounded mb-4 p-4 border"
          >
            {/* Top-level Expense Info */}
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Date:</span>
              <span>{new Date(exp.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Vendor:</span>
              <span>{exp.vendor}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Grand Total:</span>
              {/* Use ?? 0 fallback */}
              <span>${(exp.grandTotal ?? 0).toFixed(2)}</span>
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

            {/* Now list each Line Item */}
            <div className="mt-4">
              <p className="font-semibold underline">Line Items:</p>
              {exp.lineItems?.map((li, index) => (
                <div key={index} className="border rounded p-2 mt-2">
                  <p>
                    <span className="font-semibold">Category:</span> {li.category}
                  </p>
                  <p>
                    <span className="font-semibold">Item:</span> {li.item}
                  </p>
                  <p>
                    <span className="font-semibold">Unit Cost:</span>{" "}
                    ${(li.unitCost ?? 0).toFixed(2)}
                  </p>
                  <p>
                    <span className="font-semibold">Quantity:</span> {li.quantity}
                  </p>
                  <p>
                    <span className="font-semibold">Line Total:</span>{" "}
                    ${(li.lineTotal ?? 0).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
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

  /**
   * DESKTOP layout (table) for screens >= md
   */
  const DesktopExpenseTable = () => (
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Vendor</th>
            <th className="p-2">Category (Line Item)</th>
            <th className="p-2">Item</th>
            <th className="p-2">Unit Cost</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Line Total</th>
            <th className="p-2">Grand Total</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Receipt</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {expenses.map((exp) => {
            const receiptUrl = imageUrls[exp.id];
            const rowCount = exp.lineItems?.length || 1;

            return (
              <React.Fragment key={exp.id}>
                {exp.lineItems && exp.lineItems.length > 0 ? (
                  exp.lineItems.map((li, liIndex) => (
                    <tr
                      key={`${exp.id}-${liIndex}`}
                      className="hover:bg-blue-50 transition-colors"
                    >
                      {/* For the first line item, show top-level fields with rowSpan */}
                      {liIndex === 0 && (
                        <>
                          <td rowSpan={rowCount} className="p-2">
                            {new Date(exp.date).toLocaleDateString()}
                          </td>
                          <td rowSpan={rowCount} className="p-2">
                            {exp.vendor}
                          </td>
                        </>
                      )}

                      {/* Now the line item fields */}
                      <td className="p-2">{li.category}</td>
                      <td className="p-2">{li.item}</td>
                      {/* Use ?? 0 fallback */}
                      <td className="p-2">${(li.unitCost ?? 0).toFixed(2)}</td>
                      <td className="p-2">{li.quantity}</td>
                      <td className="p-2">${(li.lineTotal ?? 0).toFixed(2)}</td>

                      {liIndex === 0 && (
                        <>
                          {/* Grand total with fallback */}
                          <td rowSpan={rowCount} className="p-2 font-bold text-red-500">
                            ${(exp.grandTotal ?? 0).toFixed(2)}
                          </td>
                          <td rowSpan={rowCount} className="p-2">
                            {exp.description || ""}
                          </td>
                          <td rowSpan={rowCount} className="p-2">
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
                          <td rowSpan={rowCount} className="p-2">
                            <div className="flex flex-col gap-2">
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
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  // If for some reason an expense has no lineItems
                  <tr className="hover:bg-blue-50 transition-colors">
                    <td className="p-2">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{exp.vendor}</td>
                    <td colSpan={4} className="p-2 text-gray-500 italic">
                      No line items
                    </td>
                    {/* Use fallback for grandTotal */}
                    <td className="p-2 font-bold">${(exp.grandTotal ?? 0).toFixed(2)}</td>
                    <td className="p-2">{exp.description || ""}</td>
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
                      <Button
                        onClick={() => navigate(`/edit-expense/${exp.id}`)}
                        className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1 px-3 py-1 rounded"
                      >
                        <PencilAltIcon className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => onDelete(exp.id)}
                        className="bg-red-500 hover:bg-red-600 flex items-center gap-1 px-3 py-1 rounded ml-2"
                      >
                        <TrashIcon className="w-4 h-4" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
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
