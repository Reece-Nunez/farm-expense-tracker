import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useForm } from "react-hook-form";
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
import { expenseSchema } from "@/schemas/expenseSchema";

// Optionally, import some icons from Heroicons
import {
  CalendarIcon,
  CurrencyDollarIcon,
  CollectionIcon,
} from "@heroicons/react/outline";

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

function ExpenseForm({ onValidSubmit, editingExpense }, ref) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: "",
      unitCost: "",
      quantity: "",
      category: "",
      item: "",
      vendor: "",
      description: "",
    },
  });

  // Expose a method to reset the form to the parent
  useImperativeHandle(ref, () => ({
    resetForm: () => reset(),
  }));

  // When editing, pre-fill the form. Convert unitCost to a string if needed.
  useEffect(() => {
    if (editingExpense) {
      reset({
        ...editingExpense,
        date: new Date(editingExpense.date),
        unitCost:
          typeof editingExpense.unitCost === "number"
            ? editingExpense.unitCost.toString()
            : editingExpense.unitCost,
      });
    }
  }, [editingExpense, reset]);

  const watchDate = watch("date");
  const watchUnitCost = watch("unitCost");
  const watchQuantity = watch("quantity");
  const navigate = useNavigate();

  const totalCost =
    parseFloat(watchUnitCost || 0) * parseFloat(watchQuantity || 0) || 0;

  const onValid = (data) => {
    onValidSubmit({
      ...data,
      date: data.date.toISOString().split("T")[0],
      totalCost,
    });
  };

  const onInvalid = () => {
    toast.error("Please fix errors before submitting.");
  };

  const handleDateChange = (selectedDate) => {
    setValue("date", selectedDate || "");
  };

  const handleUnitCostChange = (val) => {
    setValue("unitCost", val || "");
  };

  return (
    <Card className="max-w-4xl mx-auto p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-3xl font-bold flex items-center justify-center mb-6">
        Expense Form
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          {/* Date Field */}
          <div>
            <label className="block font-medium mb-1 flex items-center gap-1">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={watchDate ? new Date(watchDate) : null}
              onChange={handleDateChange}
              placeholderText="Select Date"
              dateFormat="yyyy-MM-dd"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.date ? "border-red-500 animate-shake" : ""
              }`}
              isClearable
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Unit Cost Field */}
          <div>
            <label className="block font-medium mb-1 flex items-center gap-1">
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
                errors.unitCost ? "border-red-500 animate-shake" : ""
              }`}
              value={watchUnitCost}
              onValueChange={handleUnitCostChange}
            />
            {errors.unitCost && (
              <p className="text-red-500 text-sm mt-1">
                {errors.unitCost.message}
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
              {...register("quantity")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.quantity ? "border-red-500 animate-shake" : ""
              }`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">
                {errors.quantity.message}
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
              {...register("category")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.category ? "border-red-500 animate-shake" : ""
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
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
              {...register("item")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.item ? "border-red-500 animate-shake" : ""
              }`}
            />
            {errors.item && (
              <p className="text-red-500 text-sm mt-1">{errors.item.message}</p>
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
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                errors.vendor ? "border-red-500 animate-shake" : ""
              }`}
            />
            {errors.vendor && (
              <p className="text-red-500 text-sm mt-1">
                {errors.vendor.message}
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
              {...register("description")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-around mt-6">
            <Button
              type="button"
              onClick={() => reset()}
              className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default forwardRef(ExpenseForm);
