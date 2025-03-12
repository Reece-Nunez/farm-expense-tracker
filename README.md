import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CurrencyInput from "react-currency-input-field";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { expenseFormSchema } from "@/schemas/expenseFormSchema";
import { uploadData } from "aws-amplify/storage";
import { CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/outline";

// Categories (unchanged)
const categories = [
  "Chemicals",
  "Conservation Expenses",
  "Custom Hire",
  "Feed Purchased",
  "Fertilizers and Lime",
  "Freight and Trucking",
  "Gasoline, Fuel, and Oil",
  "Mortgage Interest",
  "Insurance (Not Health)",
  "Other Interest",
  "Equipment Rental",
  "Farm Equipment",
  "Other Rental",
  "Repairs and Maintenance",
  "Seeds and Plants",
  "Storage and Warehousing",
  "Supplies Purchased",
  "Taxes",
  "Utilities",
  "Vet",
  "Breeding",
  "Medicine",
];

// Extend your default expense record to include an optional lineItems array.
const defaultExpense = {
  date: "",
  vendor: "",
  notes: "",
  receiptFile: null,
  // Top-level fields (for single-line entry)
  unitCost: "",
  quantity: "",
  category: "",
  item: "",
  // Nested line items (optional)
  lineItems: [],
};

function ExpenseForm({ onValidSubmit, editingExpense }, ref) {
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      expenses: [defaultExpense],
    },
  });

  useImperativeHandle(ref, () => ({
    resetForm: () => reset(),
  }));

  // Outer field array: each element is a "receipt" expense entry.
  const { fields: receiptFields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  useEffect(() => {
    if (editingExpense) {
      reset({
        expenses: [
          {
            ...editingExpense,
            date: new Date(editingExpense.date),
            // Ensure string conversion if needed:
            unitCost:
              typeof editingExpense.unitCost === "number"
                ? editingExpense.unitCost.toString()
                : editingExpense.unitCost,
            // For backwards compatibility, we prefill lineItems as empty array if missing.
            lineItems: editingExpense.lineItems || [],
          },
        ],
      });
    }
  }, [editingExpense, reset]);

  // Submit logic
  const onValid = async (data) => {
    try {
      const finalExpenses = [];

      for (let expense of data.expenses) {
        // Upload receipt file if provided
        let uploadedFileKey = "";
        if (expense.receiptFile && expense.receiptFile[0]) {
          const file = expense.receiptFile[0];
          const fileKey = `receipts/${Date.now()}_${file.name}`;
          const operation = uploadData({
            path: fileKey,
            data: file,
            options: { contentType: file.type },
          });
          await operation.result;
          uploadedFileKey = fileKey;
        }

        // Convert date to ISO (yyyy-mm-dd) if provided
        const isoDate = expense.date
          ? new Date(expense.date).toISOString().split("T")[0]
          : "";

        // If lineItems exist, push multiple expense records
        if (expense.lineItems && expense.lineItems.length > 0) {
          expense.lineItems.forEach((item) => {
            const unitCost = parseFloat(item.unitCost || 0);
            const quantity = parseFloat(item.quantity || 0);
            finalExpenses.push({
              date: isoDate,
              vendor: expense.vendor,
              description: expense.notes || "",
              category: item.category,
              item: item.item,
              quantity,
              unitCost,
              totalCost: unitCost * quantity,
              receiptImageKey: uploadedFileKey,
            });
          });
        } else {
          // Otherwise, single record from top-level fields
          const unitCost = parseFloat(expense.unitCost || 0);
          const quantity = parseFloat(expense.quantity || 0);
          finalExpenses.push({
            date: isoDate,
            vendor: expense.vendor,
            description: expense.notes || "",
            category: expense.category,
            item: expense.item,
            quantity,
            unitCost,
            totalCost: unitCost * quantity,
            receiptImageKey: uploadedFileKey,
          });
        }
      }

      await onValidSubmit(finalExpenses);
    } catch (err) {
      console.error("[ExpenseForm] File upload error:", err);
      toast.error("Error uploading file.");
    }
  };

  const onInvalid = () => {
    toast.error("Please fix errors before submitting.");
  };

  // Render each receipt entry with nested line items
  const MultiReceiptExpenseItem = ({ receiptIndex }) => {
    // Nested field array for line items within this receipt.
    const {
      fields: lineItemFields,
      append: appendLineItem,
      remove: removeLineItem,
    } = useFieldArray({
      control,
      name: `expenses.${receiptIndex}.lineItems`,
    });

    // Watch for date display
    const watchDate = watch(`expenses.${receiptIndex}.date`);

    return (
      <div className="p-6 rounded-lg bg-white shadow-md border border-gray-200 my-10">
        <h3 className="text-lg font-semibold mb-4">
          Expense #{receiptIndex + 1}
        </h3>

        {/* Shared fields for the receipt */}
        <div>
          <label className="font-medium mb-1 flex items-center gap-1">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
            Date <span className="text-red-500">*</span>
          </label>
          <DatePicker
            selected={watchDate ? new Date(watchDate) : null}
            onChange={(date) =>
              setValue(`expenses.${receiptIndex}.date`, date || "")
            }
            placeholderText="Select Date"
            dateFormat="yyyy-MM-dd"
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.expenses?.[receiptIndex]?.date
                ? "border-red-500 animate-shake"
                : ""
              }`}
            isClearable
          />
          {errors.expenses?.[receiptIndex]?.date && (
            <p className="text-red-500 text-sm mt-1">
              {errors.expenses[receiptIndex].date?.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">
            Vendor/Supplier <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Vendor"
            {...register(`expenses.${receiptIndex}.vendor`)}
            className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.expenses?.[receiptIndex]?.vendor
                ? "border-red-500 animate-shake"
                : ""
              }`}
          />
          {errors.expenses?.[receiptIndex]?.vendor && (
            <p className="text-red-500 text-sm mt-1">
              {errors.expenses[receiptIndex].vendor?.message}
            </p>
          )}
        </div>

        <div className="mt-4">
          <label className="block font-medium mb-1">Notes (Optional)</label>
          <Textarea
            placeholder="Any extra details"
            {...register(`expenses.${receiptIndex}.notes`)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="mt-4">
          <label className="block font-medium text-base mb-2">
            Receipt Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            {...register(`expenses.${receiptIndex}.receiptFile`)}
            className="block w-full text-sm text-gray-900 border border-blue-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors"
          />
        </div>

        {/* Nested line items for this receipt */}
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Line Items</h4>
          {lineItemFields.map((lineField, lineIndex) => {
            // Watch for line total calculation
            const watchUnitCost = watch(
              `expenses.${receiptIndex}.lineItems.${lineIndex}.unitCost`
            );
            const watchQuantity = watch(
              `expenses.${receiptIndex}.lineItems.${lineIndex}.quantity`
            );
            const lineTotal =
              parseFloat(watchUnitCost || 0) * parseFloat(watchQuantity || 0);

            return (
              <div
                key={lineField.id}
                className="border-b border-gray-200 py-4 mb-4 last:border-none last:mb-0"
              >
                <div className="mt-2">
                  <label className="block font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register(
                      `expenses.${receiptIndex}.lineItems.${lineIndex}.category`
                    )}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.expenses?.[receiptIndex]?.lineItems?.[lineIndex]
                        ?.category
                        ? "border-red-500 animate-shake"
                        : ""
                      }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                  {errors.expenses?.[receiptIndex]?.lineItems?.[lineIndex]
                    ?.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          errors.expenses[receiptIndex].lineItems[lineIndex]
                            .category.message
                        }
                      </p>
                    )}
                </div>

                <div className="mt-2">
                  <label className="block font-medium mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Item"
                    {...register(
                      `expenses.${receiptIndex}.lineItems.${lineIndex}.item`
                    )}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.expenses?.[receiptIndex]?.lineItems?.[lineIndex]
                        ?.item
                        ? "border-red-500 animate-shake"
                        : ""
                      }`}
                  />
                  {errors.expenses?.[receiptIndex]?.lineItems?.[lineIndex]
                    ?.item && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          errors.expenses[receiptIndex].lineItems[lineIndex].item
                            .message
                        }
                      </p>
                    )}
                </div>

                <div className="mt-2">
                  <label className="block font-medium mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    {...register(
                      `expenses.${receiptIndex}.lineItems.${lineIndex}.quantity`,
                      { valueAsNumber: true }
                    )}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.expenses?.[receiptIndex]?.lineItems?.[lineIndex]
                        ?.quantity
                        ? "border-red-500 animate-shake"
                        : ""
                      }`}
                  />
                  {errors.expenses?.[receiptIndex]?.lineItems?.[lineIndex]
                    ?.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          errors.expenses[receiptIndex].lineItems[lineIndex]
                            .quantity.message
                        }
                      </p>
                    )}
                </div>

                <div className="mt-2">
                  <label className="block font-medium mb-1 flex items-center gap-1">
                    <CurrencyDollarIcon className="w-5 h-5 text-blue-500" />
                    Unit Cost <span className="text-red-500">*</span>
                  </label>
                  {/* Use Controller here for CurrencyInput */}
                  <Controller
                    control={control}
                    name={`expenses.${receiptIndex}.lineItems.${lineIndex}.unitCost`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CurrencyInput
                        prefix="$"
                        allowDecimals={true}
                        decimalsLimit={2}
                        allowNegativeValue={false}
                        decimalSeparator="."
                        groupSeparator=","
                        placeholder="Unit Cost"
                        value={value}
                        onValueChange={(val) => onChange(val || "")}
                        onBlur={onBlur}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors.expenses?.[receiptIndex]?.lineItems?.[
                            lineIndex
                          ]?.unitCost
                            ? "border-red-500 animate-shake"
                            : ""
                          }`}
                      />
                    )}
                  />
                  {errors.expenses?.[receiptIndex]?.lineItems?.[lineIndex]
                    ?.unitCost && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          errors.expenses[receiptIndex].lineItems[lineIndex]
                            .unitCost.message
                        }
                      </p>
                    )}
                </div>

                <div className="mt-2">
                  <label className="block font-medium mb-1">
                    Line Item Total
                  </label>
                  <Input
                    readOnly
                    value={
                      lineTotal > 0
                        ? `$${Number(lineTotal).toFixed(2)}`
                        : ""
                    }
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>

                <div className="mt-4 flex justify-center">
                  <Button
                    type="button"
                    onClick={() => removeLineItem(lineIndex)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Remove Item
                  </Button>
                </div>
              </div>
            );
          })}
          <div className="mt-4 flex justify-around">
            <Button
              type="button"
              onClick={() =>
                appendLineItem({
                  category: "",
                  item: "",
                  quantity: 1,
                  unitCost: "",
                })
              }
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
            >
              + Add Another Line Item
            </Button>
            <Button
              type="button"
              onClick={() => remove(receiptIndex)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Remove This Receipt
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-md md:max-w-4xl mx-auto p-4 md:p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-2xl md:text-3xl font-bold flex items-center justify-center mb-6">
        Expense Form
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit(onValid, onInvalid)}
          // Prevent accidental "Enter" from reloading the page:
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
            }
          }}
        >
          {receiptFields.map((receiptField, receiptIndex) => (
            <MultiReceiptExpenseItem
              key={receiptField.id}
              receiptIndex={receiptIndex}
            />
          ))}

          <div className="flex flex-col sm:flex-row justify-around gap-4 m-12">
            <Button
              type="button"
              onClick={() =>
                append({
                  date: "",
                  vendor: "",
                  notes: "",
                  receiptFile: null,
                  lineItems: [
                    {
                      category: "",
                      item: "",
                      quantity: 1,
                      unitCost: "",
                    },
                  ],
                  // Also include top-level fields for backwards compatibility:
                  unitCost: "",
                  quantity: "",
                  category: "",
                  item: "",
                })
              }
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
            >
              + Add Another Receipt
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Submit All
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default forwardRef(ExpenseForm);
