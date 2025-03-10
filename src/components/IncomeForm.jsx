import React, { useImperativeHandle, forwardRef, useEffect } from "react";
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
import { incomeSchema } from "@/schemas/incomeSchema";
import { CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/outline";

// Define options
const paymentMethods = ["Venmo", "Checks", "Cash", "Other"];
const itemsSold = ["Eggs", "Beef", "Pork", "Other"];

const IncomeForm = forwardRef((props, ref) => {
  const { onValidSubmit, editingIncome } = props;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: "",
      pricePerUnit: "",
      weightOrQuantity: "",
      item: "",
      paymentMethod: "",
      notes: "",
    },
  });

  // Expose a reset method
  useImperativeHandle(ref, () => ({
    resetForm: () => reset(),
  }));

  useEffect(() => {
    if (editingIncome) {
      reset({
        ...editingIncome,
        date: editingIncome.date ? new Date(editingIncome.date) : "",
        notes: editingIncome.notes || "",
        item: editingIncome.item || "",
        paymentMethod: editingIncome.paymentMethod || "",
      });
    }
  }, [editingIncome, reset]);

  const watchDate = watch("date");
  const watchPricePerUnit = watch("pricePerUnit");
  const watchWeightOrQuantity = parseFloat(watch("weightOrQuantity")) || 0;
  const amount =
    parseFloat(watchPricePerUnit || 0) * watchWeightOrQuantity || 0;

  const navigate = useNavigate();

  const onValid = (data) => {
    // Convert date to YYYY-MM-DD
    const dateValue = data.date ? new Date(data.date) : null;
    const isoDate = dateValue ? dateValue.toISOString().split("T")[0] : "";
    const parsedQuantity = parseFloat(data.weightOrQuantity || "0");
    const parsedPrice = parseFloat(data.pricePerUnit || "0");
    const computedAmount = parsedPrice * parsedQuantity;
    const finalObj = {
      userId: "", // will be set in parent code
      date: isoDate,
      paymentMethod: data.paymentMethod,
      item: data.item || "Other",
      amount: parseFloat(computedAmount.toFixed(2)),
      notes: data.notes || "",
    };
    onValidSubmit(finalObj);
    reset();
  };

  const onInvalid = (formErrors) => {
    console.log("[IncomeForm] Validation errors:", formErrors);
    toast.error("Please fix errors before submitting.");
  };

  const handleDateChange = (date) => {
    setValue("date", date || "");
  };

  const handlePriceChange = (val) => {
    setValue("pricePerUnit", val || "");
  };

  return (
    <Card className="w-full max-w-md md:max-w-4xl mx-auto p-4 md:p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-2xl md:text-3xl font-bold text-center mb-4">
        Income Form
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block font-medium mb-1">
              <CalendarIcon className="inline-block w-5 h-5 text-blue-500 mr-1" />
              Date <span className="text-red-500">*</span>
            </label>
            <DatePicker
              selected={watchDate ? new Date(watchDate) : null}
              onChange={handleDateChange}
              placeholderText="Select Date"
              dateFormat="yyyy-MM-dd"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                errors.date ? "border-red-500 animate-shake" : ""
              }`}
              isClearable
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block font-medium mb-1">Payment Method</label>
            <Select
              {...register("paymentMethod")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <option value="">Select Payment Method</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
          </div>

          {/* Item Sold */}
          <div>
            <label className="block font-medium mb-1">
              Item Sold <span className="text-red-500">*</span>
            </label>
            <Select
              {...register("item")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                errors.item ? "border-red-500 animate-shake" : ""
              }`}
            >
              <option value="">Select Item Sold</option>
              {itemsSold.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {errors.item && (
              <p className="text-red-500 text-sm mt-1">{errors.item.message}</p>
            )}
          </div>

          {/* Weight/Quantity and Price Per Unit */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Weight/Quantity</label>
              <Input
                type="number"
                step="any"
                placeholder="e.g., 12 (dozens) or 50 (lbs)"
                {...register("weightOrQuantity")}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Price Per Unit</label>
              <CurrencyInput
                prefix="$"
                decimalsLimit={2}
                decimalScale={2}
                allowNegativeValue={false}
                placeholder="Price per unit"
                value={watchPricePerUnit}
                onValueChange={handlePriceChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>

          {/* Computed Amount */}
          <div>
            <label className="block font-medium">Total Amount</label>
            <Input
              readOnly
              value={amount > 0 ? `$${amount.toFixed(2)}` : "$0.00"}
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-1">Notes (Optional)</label>
            <Textarea
              placeholder="Any extra details"
              {...register("notes")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-around gap-4 mt-6">
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
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Dashboard
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

export default IncomeForm;
