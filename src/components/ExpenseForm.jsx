import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CurrencyInput from "react-currency-input-field";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { toast } from "react-hot-toast"; // for toasts

import { expenseSchema } from "@/schemas/expenseSchema"; // import our Zod schema

//Typical Farm Expense Categories
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

//Start form with blank fields
export default function ExpenseForm({
  onValidSubmit, // function to call with final data
}) {
  // Set up React Hook Form with our Zod schema
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
      date: "", // or null
      unitCost: "",
      quantity: "",
      category: "",
      item: "",
      vendor: "",
      description: "",
    },
  });

  // Watch fields for dynamic calculations
  const watchDate = watch("date");
  const watchUnitCost = watch("unitCost");
  const watchQuantity = watch("quantity");

  // Calculate total cost
  const totalCost =
    parseFloat(watchUnitCost || 0) * parseFloat(watchQuantity || 0) || 0;

  // React Hook Form onValid
  const onValid = (data) => {
    // We'll pass the validated data upward so we can do a confirmation
    onValidSubmit({
      ...data,
      // Convert date to a standard string
      dateStr: data.date.toISOString().split("T")[0],
      totalCost,
    });
  };

  // onInvalid, show a toast
  const onInvalid = () => {
    toast.error("Please fix errors before submitting.");
  };

  // DatePicker integration
  const handleDateChange = (selectedDate) => {
    setValue("date", selectedDate || ""); // store as Date or empty
  };

  // CurrencyInput integration
  const handleUnitCostChange = (val) => {
    setValue("unitCost", val || "");
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 mb-6">
      <CardHeader className="text-2xl font-bold">
        Farm Expense Tracker
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
          {/* Date */}
          <div>
            <label className="block font-medium">
              Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={watchDate ? new Date(watchDate) : null}
              onChange={handleDateChange}
              placeholderText="Select Date"
              dateFormat="yyyy-MM-dd"
              className={`w-full border rounded px-3 py-2 ${
                errors.quantity ? "animate-shake border-red-500" : ""
              }`}
              isClearable
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>

          {/* Unit Cost */}
          <div>
            <label className="block font-medium">
              Unit Cost <span className="text-red-500">*</span>
            </label>
            <CurrencyInput
              prefix="$"
              decimalsLimit={2}
              decimalScale={2}
              allowNegativeValue={false}
              placeholder="Unit Cost"
              className={`w-full border rounded px-3 py-2 ${
                errors.quantity ? "animate-shake border-red-500" : ""
              }`}
              value={watchUnitCost}
              onValueChange={handleUnitCostChange}
            />
            {errors.unitCost && (
              <p className="text-red-500 text-sm">{errors.unitCost.message}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block font-medium">
              Quantity <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              placeholder="Quantity"
              {...register("quantity")}
              className={`w-full border rounded px-3 py-2 ${
                errors.quantity ? "animate-shake border-red-500" : ""
              }`}
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm">{errors.quantity.message}</p>
            )}
          </div>

          {/* Total Cost (computed) */}
          <div>
            <label className="block font-medium">Total Cost</label>
            <Input
              readOnly
              value={totalCost > 0 ? `$${totalCost.toFixed(2)}` : ""}
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium">
              Category <span className="text-red-500">*</span>
            </label>
            <Select
              {...register("category")}
              className={`w-full border rounded px-3 py-2 ${
                errors.quantity ? "animate-shake border-red-500" : ""
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
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          {/* Item */}
          <div>
            <label className="block font-medium">
              Item/Description <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Item"
              {...register("item")}
              className={`w-full border rounded px-3 py-2 ${
                errors.quantity ? "animate-shake border-red-500" : ""
              }`}
            />
            {errors.item && (
              <p className="text-red-500 text-sm">{errors.item.message}</p>
            )}
          </div>

          {/* Vendor */}
          <div>
            <label className="block font-medium">
              Vendor/Supplier <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Vendor"
              {...register("vendor")}
              className={`w-full border rounded px-3 py-2 ${
                errors.quantity ? "animate-shake border-red-500" : ""
              }`}
            />
            {errors.vendor && (
              <p className="text-red-500 text-sm">{errors.vendor.message}</p>
            )}
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block font-medium">
              Notes/Description (Optional)
            </label>
            <Textarea
              placeholder="Any extra details"
              {...register("description")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <Button
              type="button"
              onClick={() => reset()}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
