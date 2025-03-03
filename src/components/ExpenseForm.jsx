import React, { useEffect, useImperativeHandle, forwardRef } from "react";
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
import { expenseFormSchema } from "@/schemas/expenseFormSchema";
import { Storage } from "@aws-amplify";
import { CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/outline";

// Typical Farm Expense Categories
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

const defaultExpense = {
  date: "",
  unitCost: "",
  quantity: "",
  category: "",
  item: "",
  vendor: "",
  description: "",
  receiptFile: null,
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
    defaultValues: {
      expenses: [defaultExpense],
    },
  });

  // Expose a method to reset the form to the parent
  useImperativeHandle(ref, () => ({
    resetForm: () => reset(),
  }));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "expenses",
  });

  // When editing, pre-fill the form. Convert unitCost to a string if needed.
  useEffect(() => {
    if (editingExpense) {
      reset({
        expenses: [
          {
            ...editingExpense,
            date: new Date(editingExpense.date),
            unitCost:
              typeof editingExpense.unitCost === "number"
                ? editingExpense.unitCost.toString()
                : editingExpense.unitCost,
          },
        ],
      });
    }
  }, [editingExpense, reset]);

  const navigate = useNavigate();

  const onValid = async (data) => {
    try {
      const formattedExpenses = [];

      // data.expenses is an array
      for (let expense of data.expenses) {
        // Convert date to yyyy-MM-dd
        const isoDate = expense.date
          ? expense.date.toISOString().split("T")[0]
          : "";

        // Calculate totalCost
        const totalCost =
          parseFloat(expense.unitCost || 0) *
            parseFloat(expense.quantity || 0) || 0;

        // Prepare the single expense object
        const newExpense = {
          ...expense,
          date: isoDate,
          totalCost,
        };

        // 1) If the user selected a file (receiptFile), upload to S3
        if (expense.receiptFile && expense.receiptFile[0]) {
          const file = expense.receiptFile[0];
          // You can generate a unique key. For simplicity, use a timestamp + original name
          const fileKey = `receipts/${Date.now()}_${file.name}`;

          // Upload to S3 using Amplify Storage
          const uploadResult = await Storage.put(fileKey, file, {
            contentType: file.type,
          });

          // 2) Store the S3 key in the newExpense object
          newExpense.receiptImageKey = fileKey;
        }

        // 3) No file selected => no change to receiptImageKey (will remain undefined)
        formattedExpenses.push(newExpense);
      }

      // Now pass the entire array to the parent's submit handler
      onValidSubmit(formattedExpenses);
    } catch (err) {
      console.error("[ExpenseForm] File upload error:", err);
      toast.error("Error uploading file.");
    }
  };

  const onInvalid = () => {
    toast.error("Please fix errors before submitting.");
  };

  return (
    <Card className="max-w-4xl mx-auto p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-3xl font-bold flex items-center justify-center mb-6">
        Expense Form
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          {fields.map((field, index) => {
            // Watch each expense field by its index
            const expenseDate = watch(`expenses.${index}.date`);
            const expenseUnitCost = watch(`expenses.${index}.unitCost`);
            const expenseQuantity = watch(`expenses.${index}.quantity`);
            const totalCost =
              parseFloat(expenseUnitCost || 0) *
                parseFloat(expenseQuantity || 0) || 0;
            return (
              <div
                key={field.id}
                className="p-6 rounded-lg bg-white shadow-md border border-gray-200 transition-transform hover:scale-105 my-10"
              >
                {/* Date Field */}
                <div>
                  <label className="font-medium mb-1 flex items-center gap-1">
                    <CalendarIcon className="w-5 h-5 text-blue-500" />
                    Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={expenseDate ? new Date(expenseDate) : null}
                    onChange={(date) =>
                      setValue(`expenses.${index}.date`, date || "")
                    }
                    placeholderText="Select Date"
                    dateFormat="yyyy-MM-dd"
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      errors?.expenses?.[index]?.date
                        ? "border-red-500 animate-shake"
                        : ""
                    }`}
                    isClearable
                  />
                  {errors?.expenses?.[index]?.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expenses[index].date.message}
                    </p>
                  )}
                </div>

                {/* Unit Cost Field */}
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
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      errors?.expenses?.[index]?.unitCost
                        ? "border-red-500 animate-shake"
                        : ""
                    }`}
                    value={expenseUnitCost}
                    onValueChange={(val) =>
                      setValue(`expenses.${index}.unitCost`, val || "")
                    }
                  />
                  {errors?.expenses?.[index]?.unitCost && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expenses[index].unitCost.message}
                    </p>
                  )}
                </div>

                {/* Quantity Field */}
                <div>
                  <label className="block font-medium mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    {...register(`expenses.${index}.quantity`)}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      errors?.expenses?.[index]?.quantity
                        ? "border-red-500 animate-shake"
                        : ""
                    }`}
                  />
                  {errors?.expenses?.[index]?.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expenses[index].quantity.message}
                    </p>
                  )}
                </div>

                {/* Computed Total Cost */}
                <div>
                  <label className="block font-medium">Total Cost</label>
                  <Input
                    readOnly
                    value={totalCost > 0 ? `$${totalCost.toFixed(2)}` : ""}
                    className="w-full border rounded px-3 py-2 bg-gray-100"
                  />
                </div>

                {/* Category Field */}
                <div>
                  <label className="block font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    {...register(`expenses.${index}.category`)}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      errors?.expenses?.[index]?.category
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
                  {errors?.expenses?.[index]?.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expenses[index].category.message}
                    </p>
                  )}
                </div>

                {/* Item / Description Field */}
                <div>
                  <label className="block font-medium mb-1">
                    Item/Description <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Item"
                    {...register(`expenses.${index}.item`)}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      errors?.expenses?.[index]?.item
                        ? "border-red-500 animate-shake"
                        : ""
                    }`}
                  />
                  {errors?.expenses?.[index]?.item && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expenses[index].item.message}
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
                    {...register(`expenses.${index}.vendor`)}
                    className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                      errors?.expenses?.[index]?.vendor
                        ? "border-red-500 animate-shake"
                        : ""
                    }`}
                  />
                  {errors?.expenses?.[index]?.vendor && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.expenses[index].vendor.message}
                    </p>
                  )}
                </div>

                {/* Description Field */}
                <div>
                  <label className="block font-medium mb-1">
                    Notes/Description (Optional)
                  </label>
                  <Textarea
                    placeholder="Any extra details"
                    {...register(`expenses.${index}.description`)}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>

                {/* Receipt File Field */}
                <div>
                  <label className="block font-medium mb-1">
                    Receipt Image (Optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register(`expenses.${index}.receiptFile`)}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload a picture of the receipt (optional).
                  </p>
                </div>

                <div className="flex justify-around mt-6">
                  <Button
                    type="button"
                    onClick={() =>
                      setValue(`expenses.${index}`, { ...defaultExpense })
                    }
                    className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Back to Dashboard
                  </Button>
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-around m-12">
            <Button
              type="button"
              onClick={() => append(defaultExpense)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg"
            >
              Add Expense
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
