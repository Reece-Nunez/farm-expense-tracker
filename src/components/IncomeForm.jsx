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

import {
  CalendarIcon,
  CurrencyDollarIcon,
  CollectionIcon,
} from "@heroicons/react/outline";

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
      description: "",
    },
  });

  // Expose a reset method
  useImperativeHandle(ref, () => ({
    resetForm: () => reset(),
  }));

  // When editingIncome changes, prefill the form.
  useEffect(() => {
    if (editingIncome) {
      reset({
        ...editingIncome,
        date: new Date(editingIncome.date),
        pricePerUnit: editingIncome.pricePerUnit
          ? editingIncome.pricePerUnit.toString()
          : "",
        weightOrQuantity: editingIncome.weightOrQuantity
          ? editingIncome.weightOrQuantity.toString()
          : "",
      });
    }
  }, [editingIncome, reset]);

  const watchDate = watch("date");
  const item = watch("item");
  const navigate = useNavigate();

  const watchPricePerUnit = watch("pricePerUnit");
  const watchWeightOrQuantity = parseFloat(watch("weightOrQuantity")) || 0;
  const amount =
    parseFloat(watchPricePerUnit || 0) *
      parseFloat(watchWeightOrQuantity || 0) || 0;

  const onValid = (data) => {
    console.log("[IncomeForm] Raw form data:", data);
    const parsedWeightOrQuantity = parseFloat(data.weightOrQuantity || "0");
    const parsedPricePerUnit = parseFloat(data.pricePerUnit || "0");
    const computedAmount = parsedWeightOrQuantity * parsedPricePerUnit;
    const finalAmount = parseFloat(computedAmount.toFixed(2));
    let dateValue = null;
    if (data.date) {
      dateValue = new Date(data.date);
    }
    const finalObj = {
      ...data,
      weightOrQuantity: parsedWeightOrQuantity,
      pricePerUnit: parsedPricePerUnit,
      amount: finalAmount,
      date: dateValue ? dateValue.toISOString().split("T")[0] : "",
    };
    console.log("[IncomeForm] Final object:", finalObj);
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
    <Card className="max-w-4xl mx-auto p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-3xl font-bold text-center mb-6">
        Income Form
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block font-medium mb-1">
            <CalendarIcon className="w-5 h-5 text-blue-500" />
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
            <label className="block font-medium mb-1">
              Payment Method <span className="text-red-500">*</span>
            </label>
            <Select
              {...register("paymentMethod")}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                errors.paymentMethod ? "border-red-500 animate-shake" : ""
              }`}
            >
              <option value="">Select Payment Method</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </Select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm mt-1">
                {errors.paymentMethod.message}
              </p>
            )}
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

          {/* Weight/Quantity */}
          {item && item !== "Other" && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                step="any"
                placeholder={item === "Eggs" ? "Enter dozens" : "Enter weight"}
                {...register("weightOrQuantity", {
                  setValueAs: (val) =>
                    val === "" ? undefined : parseFloat(val),
                })}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                  errors.weightOrQuantity ? "border-red-500 animate-shake" : ""
                }`}
              />
              <span className="text-gray-700 font-medium">
                {item === "Eggs" ? "dozen" : "lb"}
              </span>
            </div>
          )}

          {/* Price per Unit */}
          <div className="flex items-center gap-2">
            <CurrencyInput
              prefix="$"
              decimalsLimit={2}
              decimalScale={2}
              allowNegativeValue={false}
              placeholder="Price per unit"
              value={watchPricePerUnit}
              onValueChange={handlePriceChange}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                errors.pricePerUnit ? "border-red-500 animate-shake" : ""
              }`}
            />
            <span className="text-gray-700 font-medium">
              {item === "Eggs" ? "per dozen" : "per lb"}
            </span>
          </div>

          {/* Computed Total */}
          <div>
            <label className="block font-medium">Total Amount</label>
            <Input
              readOnly
              value={amount > 0 ? `$${amount.toFixed(2)}` : ""}
              className="w-full border rounded px-3 py-2 bg-gray-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">
              Description (Optional)
            </label>
            <Textarea
              placeholder="Any extra details"
              {...register("description")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-around mt-6 space-x-4">
            <Button
              type="button"
              onClick={() => {
                console.log("[IncomeForm] Resetting form");
                reset();
              }}
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
