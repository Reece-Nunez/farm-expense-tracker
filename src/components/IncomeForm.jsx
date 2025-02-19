import React, { useImperativeHandle, forwardRef } from "react";
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

const paymentMethods = ["Venmo", "Checks", "Cash", "Other"];
const itemsSold = ["Eggs", "Beef", "Pork", "Other"];

const IncomeForm = forwardRef((props, ref) => {
  const { onValidSubmit } = props;

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

  // Expose a method to reset the form to the parent
  useImperativeHandle(ref, () => ({
    resetForm: () => reset(),
  }));

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

    // parse numeric fields
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

    console.log("[IncomeForm] Final object passed to onValidSubmit:", finalObj);
    onValidSubmit(finalObj);

    // Reset the form after successful submit
    reset();
  };

  const onInvalid = (formErrors) => {
    console.log(
      "[IncomeForm] Validation errors from React Hook Form:",
      formErrors
    );
    toast.error("Please fix errors before submitting.");
  };

  const handleDateChange = (date) => {
    setValue("date", date || "");
  };

  const handlePriceChange = (val) => {
    setValue("pricePerUnit", val || "");
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 mb-6">
      <CardHeader className="text-2xl font-bold flex items-center justify-center mb-6">
        Income Form
      </CardHeader>
      <CardContent className="mt-4 space-y-6">
        <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-6">
          <DatePicker
            selected={watchDate ? new Date(watchDate) : null}
            onChange={handleDateChange}
            placeholderText="Select Date"
            dateFormat="yyyy-MM-dd"
            className={`w-full border rounded px-3 py-2 ${
              errors.date ? "animate-shake border-red-500" : ""
            }`}
            isClearable
          />

          <Select
            {...register("paymentMethod")}
            className={`w-full border rounded px-3 py-2 ${
              errors.paymentMethod ? "animate-shake border-red-500" : ""
            }`}
          >
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </Select>

          <Select
            {...register("item")}
            className={`w-full border rounded px-3 py-2 ${
              errors.item ? "animate-shake border-red-500" : ""
            }`}
          >
            <option value="">Select Item Sold</option>
            {itemsSold.map((itemOption) => (
              <option key={itemOption} value={itemOption}>
                {itemOption}
              </option>
            ))}
          </Select>

          {item && item !== "Other" && (
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                step="any"
                placeholder={item === "Eggs" ? "Enter dozens" : "Enter weight"}
                // IMPORTANT: setValueAs to convert from string -> number
                {...register("weightOrQuantity", {
                  setValueAs: (val) =>
                    val === "" ? undefined : parseFloat(val),
                })}
                className={`w-full border rounded px-3 py-2 ${
                  errors.weightOrQuantity ? "animate-shake border-red-500" : ""
                }`}
              />
              <span className="text-gray-700 font-medium">
                {item === "Eggs" ? "dozen" : "lb"}
              </span>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <CurrencyInput
              prefix="$"
              decimalsLimit={2}
              decimalScale={2}
              allowNegativeValue={false}
              placeholder="Price per dozen or pound"
              value={watchPricePerUnit}
              onValueChange={handlePriceChange}
              className={`w-full border rounded px-3 py-2 ${
                errors.pricePerUnit ? "animate-shake border-red-500" : ""
              }`}
            />
            <span className="text-gray-700 font-medium">
              {item === "Eggs" ? "dozen" : "lb"}
            </span>
          </div>

          <Input
            readOnly
            value={amount > 0 ? `$${amount.toFixed(2)}` : ""}
            className="w-full border rounded px-3 py-2 bg-gray-100"
            placeholder="Total Amount"
          />

          <Textarea
            placeholder="Description (optional)"
            {...register("description")}
            className={`w-full border rounded px-3 py-2 ${
              errors.description ? "animate-shake border-red-500" : ""
            }`}
          />

          <div className="flex justify-around mt-4 space-x-4">
            <Button
              type="button"
              onClick={() => reset()}
              className="bg-slate-700 hover:bg-gray-600 text-black px-4 py-2 rounded"
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Submit
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
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
