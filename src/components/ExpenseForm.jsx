import React, {
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
// If using AWS Amplify for file uploads:
import { uploadData } from "aws-amplify/storage";
import { CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/outline";

// Import your nested schema that expects { date, vendor, lineItems[], ... }
import { expenseFormSchema } from "@/schemas/expenseFormSchema";

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

// Default shape for one line item
const defaultLineItem = {
  item: "",
  category: "",
  unitCost: "",
  quantity: "",
};

// Default values for the entire expense form
// (one expense that has a lineItems array)
const defaultExpense = {
  date: null,       // store a Date object in the form
  vendor: "",
  description: "",
  receiptFile: null,
  lineItems: [defaultLineItem],
};

function ExpenseForm({ onValidSubmit, editingExpense }, ref) {
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
    defaultValues: defaultExpense,
  });

  useImperativeHandle(ref, () => ({
    resetForm: () => reset(defaultExpense),
  }));

  // useFieldArray for lineItems
  const { fields: lineItemFields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  // If editing an existing Expense, pre-fill fields
  useEffect(() => {
    if (editingExpense) {
      reset({
        ...editingExpense,
        // convert date string to Date object
        date: editingExpense.date ? new Date(editingExpense.date) : null,
        // if no lineItems, have at least one blank
        lineItems: editingExpense.lineItems?.length
          ? editingExpense.lineItems.map((li) => ({
            item: li.item ?? "",
            category: li.category ?? "",
            unitCost:
              typeof li.unitCost === "number"
                ? li.unitCost.toString()
                : li.unitCost ?? "",
            quantity:
              typeof li.quantity === "number"
                ? li.quantity.toString()
                : li.quantity ?? "",
          }))
          : [defaultLineItem],
      });
    }
  }, [editingExpense, reset]);

  const navigate = useNavigate();

  // -----------------------------
  // Submit Handler (Returns ONE expense object)
  // -----------------------------
  const onValid = useCallback(
    async (data) => {
      try {
        // 1) Convert date to YYYY-MM-DD if needed
        const isoDate = data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "";

        // 2) Upload receiptFile (optional)
        let receiptImageKey = null;
        if (data.receiptFile && data.receiptFile[0]) {
          const file = data.receiptFile[0];
          const fileKey = `receipts/${Date.now()}_${file.name}`;
          const operation = uploadData({
            path: fileKey,
            data: file,
            options: { contentType: file.type },
          });
          await operation.result;
          receiptImageKey = fileKey;
        }

        // 3) Transform lineItems into numeric cost/quantity, and compute lineTotal
        const lineItems = data.lineItems.map((li) => {
          const cost = parseFloat(li.unitCost || 0);
          const qty = parseFloat(li.quantity || 0);
          const lineTotal = cost * qty; // compute

          return {
            ...li,
            unitCost: cost,
            quantity: qty,
            lineTotal,    // store lineTotal
          };
        });

        // 4) Sum lineTotals to get a grandTotal
        const grandTotal = lineItems.reduce((sum, li) => sum + li.lineTotal, 0);

        // 5) Build a single "expense" object with lineItems + grandTotal
        const formattedExpense = {
          date: isoDate,
          vendor: data.vendor,
          description: data.description,
          receiptImageKey,
          lineItems,
          grandTotal,  // store it so the DB has it
        };

        // 6) Pass to parent
        onValidSubmit(formattedExpense);
      } catch (err) {
        console.error("[ExpenseForm] File upload error:", err);
        toast.error("Error uploading file.");
      }
    },
    [onValidSubmit]
  );


  const onInvalid = () => {
    toast.error("Please fix errors before submitting.");
  };

  // Optional: watch lineItems to compute a dynamic "grand total" in the UI
  const watchedLineItems = watch("lineItems") || [];
  const dynamicGrandTotal = watchedLineItems.reduce((sum, item) => {
    const cost = parseFloat(item.unitCost || 0);
    const qty = parseFloat(item.quantity || 0);
    return sum + cost * qty;
  }, 0);

  return (
    <Card className="w-full max-w-md md:max-w-4xl mx-auto p-4 md:p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-2xl md:text-3xl font-bold flex items-center justify-center mb-6">
        Expense Form
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          {/* Top-level Date field */}
          <div>
            <label className="font-medium mb-1 flex items-center gap-1">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={watch("date") ? new Date(watch("date")) : null}
              onChange={(date) => setValue("date", date || null)}
              placeholderText="Select Date"
              dateFormat="yyyy-MM-dd"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors?.date ? "border-red-500 animate-shake" : ""
                }`}
              isClearable
            />
            {errors?.date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Vendor Field */}
          <div>
            <label className="block font-medium mb-1">
              Vendor/Supplier <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Vendor"
              {...register("vendor")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors?.vendor ? "border-red-500 animate-shake" : ""
                }`}
            />
            {errors?.vendor && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vendor.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block font-medium mb-1">Notes (Optional)</label>
            <Textarea
              placeholder="Any extra details"
              {...register("description")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Receipt File */}
          <div>
            <label className="block font-medium text-base mb-2">
              Receipt Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("receiptFile")}
              className="block w-full text-sm text-gray-900 border border-blue-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2 italic">
              Upload a picture of the receipt (optional)
            </p>
          </div>

          {/* Line Items Section */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-2">Line Items</h2>

            {lineItemFields.map((field, index) => {
              const watchedUnitCost = watch(`lineItems.${index}.unitCost`);
              const watchedQuantity = watch(`lineItems.${index}.quantity`);
              const lineTotal =
                parseFloat(watchedUnitCost || 0) *
                parseFloat(watchedQuantity || 0) || 0;

              return (
                <div
                  key={field.id}
                  className="p-6 rounded-lg bg-white shadow-md border border-gray-200 transition-transform hover:scale-105 my-6"
                >
                  {/* Item Name */}
                  <div>
                    <label className="block font-medium mb-1">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="Item"
                      {...register(`lineItems.${index}.item`)}
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors?.lineItems?.[index]?.item
                          ? "border-red-500 animate-shake"
                          : ""
                        }`}
                    />
                    {errors?.lineItems?.[index]?.item && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lineItems[index].item.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block font-medium mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      {...register(`lineItems.${index}.category`)}
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors?.lineItems?.[index]?.category
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
                    {errors?.lineItems?.[index]?.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lineItems[index].category.message}
                      </p>
                    )}
                  </div>

                  {/* Unit Cost */}
                  <div>
                    <label className="font-medium mb-1 flex items-center gap-1">
                      <CurrencyDollarIcon className="w-5 h-5 text-blue-500" />
                      Unit Cost <span className="text-red-500">*</span>
                    </label>
                    <CurrencyInput
                      prefix="$"
                      decimalsLimit={2}
                      decimalScale={2}
                      allowNegativeValue={false}
                      placeholder="Unit Cost"
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors?.lineItems?.[index]?.unitCost
                          ? "border-red-500 animate-shake"
                          : ""
                        }`}
                      value={watchedUnitCost}
                      onValueChange={(val) =>
                        setValue(`lineItems.${index}.unitCost`, val || "")
                      }
                    />
                    {errors?.lineItems?.[index]?.unitCost && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lineItems[index].unitCost.message}
                      </p>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block font-medium mb-1">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="Quantity"
                      {...register(`lineItems.${index}.quantity`)}
                      className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${errors?.lineItems?.[index]?.quantity
                          ? "border-red-500 animate-shake"
                          : ""
                        }`}
                    />
                    {errors?.lineItems?.[index]?.quantity && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lineItems[index].quantity.message}
                      </p>
                    )}
                  </div>

                  {/* Computed Total for this line item */}
                  <div>
                    <label className="block font-medium">Line Total</label>
                    <Input
                      readOnly
                      value={lineTotal > 0 ? `$${lineTotal.toFixed(2)}` : ""}
                      className="w-full border rounded px-3 py-2 bg-gray-100"
                    />
                  </div>

                  {/* Remove line item button */}
                  <div className="flex justify-end mt-4">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Remove Item
                    </Button>
                  </div>
                </div>
              );
            })}

            <Button
              type="button"
              onClick={() => append({ ...defaultLineItem })}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Add Line Item
            </Button>
          </div>

          {/* Grand total just for display */}
          <div className="mt-6">
            <label className="block font-medium mb-1">Grand Total</label>
            <Input
              readOnly
              value={
                dynamicGrandTotal > 0
                  ? `$${dynamicGrandTotal.toFixed(2)}`
                  : ""
              }
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-around gap-4 my-8">
            <Button
              type="button"
              onClick={() => reset(defaultExpense)}
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Clear Entire Form
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default forwardRef(ExpenseForm);
