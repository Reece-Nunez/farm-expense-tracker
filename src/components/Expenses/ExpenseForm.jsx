import React, { useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
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
import { getCurrentUser } from "../../utils/getCurrentUser";
import { uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/api";
import { expenseFormSchema } from "@/schemas/expenseFormSchema";
import { CalendarIcon, CurrencyDollarIcon } from "@heroicons/react/outline";

const categories = [
  "Chemicals", "Conservation Expenses", "Custom Hire", "Feed Purchased",
  "Fertilizers and Lime", "Freight and Trucking", "Gasoline, Fuel, and Oil",
  "Mortgage Interest", "Insurance (Not Health)", "Other Interest",
  "Equipment Rental", "Farm Equipment", "Other Rental", "Repairs and Maintenance",
  "Seeds and Plants", "Storage and Warehousing", "Supplies Purchased",
  "Taxes", "Utilities", "Vet", "Breeding", "Medicine",
];

const defaultLineItem = { item: "", category: "", unitCost: "", quantity: "" };
const blankExpense = {
  date: null,
  vendor: "",
  description: "",
  receiptImageKey: null,
  receiptFile: null,
  lineItems: [defaultLineItem],
};

const ExpenseForm = forwardRef(function ExpenseForm(
  { defaultValues = {}, onValidSubmit },
  ref
) {
  const navigate = useNavigate();

  // merge defaults
  const merged = {
    ...blankExpense,
    ...defaultValues,
    date: defaultValues.date ? new Date(defaultValues.date) : blankExpense.date,
    receiptImageKey: defaultValues.receiptImageKey ?? blankExpense.receiptImageKey,
    lineItems: (defaultValues.lineItems || blankExpense.lineItems).map(li => ({
      item: li.item ?? "",
      category: li.category ?? "",
      unitCost: String(li.unitCost ?? ""),
      quantity: String(li.quantity ?? ""),
    })),
  };

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: merged,
  });

  // reset when defaultValues prop changes
  useEffect(() => {
    reset(merged);
  }, [JSON.stringify(defaultValues), reset]);

  useImperativeHandle(ref, () => ({
    resetForm: () => reset(merged),
    validateAndGetData: () => new Promise((res, rej) => handleSubmit(res, rej)()),
  }));

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  // compute grand total
  const watchedItems = watch("lineItems") || [];
  const grandTotal = watchedItems.reduce((sum, li) => {
    const cost = parseFloat(li.unitCost) || 0;
    const qty = parseFloat(li.quantity) || 0;
    return sum + cost * qty;
  }, 0);

  const onSubmit = useCallback(async data => {
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const client = generateClient();
      const isoDate = data.date ? data.date.toISOString().slice(0, 10) : null;

      let receiptImageKey = merged.receiptImageKey;
      if (data.receiptFile?.length) {
        const file = data.receiptFile[0];
        const key = `receipts/${Date.now()}_${file.name}`;
        await uploadData({ path: key, data: file, options: { contentType: file.type } }).result;
        receiptImageKey = key;
      }

      const lineItems = data.lineItems.map(li => {
        const unitCost = parseFloat(li.unitCost) || 0;
        const quantity = parseFloat(li.quantity) || 0;
        return { ...li, unitCost, quantity, lineTotal: unitCost * quantity };
      });

      onValidSubmit({
        ...data,
        id: defaultValues.id,
        date: isoDate,
        receiptImageKey,
        lineItems,
        grandTotal,
      });

      reset(blankExpense);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save expense.");
    }
  }, [defaultValues.id, merged, onValidSubmit, reset, grandTotal]);

  const onError = errs => {
    console.log("validation errors:", errs);
    toast.error("Please fix errors before submitting.");
    const el = document.querySelector(".animate-shake");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 shadow">
      <CardHeader className="text-2xl font-bold text-center mb-4">
        Expense Form
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {/* Date */}
          <label className="font-medium flex items-center gap-1 mb-1">
            <CalendarIcon className="w-5 h-5 text-blue-500" /> Date{" "}
            <span className="text-red-500">*</span>
          </label>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                {...field}
                placeholderText="yyyy-MM-dd"
                dateFormat="yyyy-MM-dd"
                className={`w-full border rounded px-3 py-2 focus:ring ${errors.date ? "border-red-500 animate-shake" : ""
                  }`}
                isClearable
              />
            )}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}

          {/* Vendor */}
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Vendor/Supplier <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("vendor")}
              placeholder="Vendor name"
              className={errors.vendor ? "border-red-500 animate-shake" : ""}
            />
            {errors.vendor && (
              <p className="text-red-500 text-sm">{errors.vendor.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block font-medium mb-1">Notes (Optional)</label>
            <Textarea
              {...register("description")}
              placeholder="Enter any notes"
            />
          </div>

          {/* Receipt */}
          <div className="mb-6">
            <label className="block font-medium mb-2">
              Receipt Image (Optional)
            </label>
            {merged.receiptImageKey && !watch("receiptFile") && (
              <img
                src={`https://farmexpensetrackerreceipts94813-main.s3.us-east-1.amazonaws.com/${merged.receiptImageKey}`}
                alt="Existing receipt"
                className="w-32 h-32 object-cover mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              {...register("receiptFile")}
            />
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Line Items</h2>
            {fields.map((field, idx) => {
              const cost = watch(`lineItems.${idx}.unitCost`);
              const qty = watch(`lineItems.${idx}.quantity`);
              const total = (parseFloat(cost || 0) * parseFloat(qty || 0)).toFixed(2);

              return (
                <div key={field.id} className="p-4 mb-4 border rounded shadow">
                  {/* Item */}
                  <div className="mb-3">
                    <label className="block font-medium mb-1">
                      Item <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register(`lineItems.${idx}.item`)}
                      className={errors.lineItems?.[idx]?.item ? "border-red-500 animate-shake" : ""}
                    />
                    {errors.lineItems?.[idx]?.item && (
                      <p className="text-red-500 text-sm">
                        {errors.lineItems[idx].item.message}
                      </p>
                    )}
                  </div>

                  {/* Category */}
                  <div className="mb-3">
                    <label className="block font-medium mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Select
                      {...register(`lineItems.${idx}.category`)}
                      className={errors.lineItems?.[idx]?.category ? "border-red-500 animate-shake" : ""}
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Select>
                    {errors.lineItems?.[idx]?.category && (
                      <p className="text-red-500 text-sm">
                        {errors.lineItems[idx].category.message}
                      </p>
                    )}
                  </div>

                  {/* Unit Cost & Quantity */}
                  <div className="flex gap-4 mb-3">
                    <div className="flex-1">
                      <label className="block font-medium mb-1 flex items-center gap-1">
                        <CurrencyDollarIcon className="w-5 h-5 text-blue-500" />{" "}
                        Unit Cost <span className="text-red-500">*</span>
                      </label>
                      <CurrencyInput
                        {...register(`lineItems.${idx}.unitCost`)}
                        prefix="$"
                        className={errors.lineItems?.[idx]?.unitCost ? "border-red-500 animate-shake w-full px-4 py-3" : "w-full px-4 py-3 border rounded"}
                        onValueChange={val => setValue(`lineItems.${idx}.unitCost`, val || "")}
                        value={watch(`lineItems.${idx}.unitCost`)}
                      />
                      {errors.lineItems?.[idx]?.unitCost && (
                        <p className="text-red-500 text-sm">
                          {errors.lineItems[idx].unitCost.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block font-medium mb-1">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        {...register(`lineItems.${idx}.quantity`)}
                        className={errors.lineItems?.[idx]?.quantity ? "border-red-500 animate-shake" : ""}
                      />
                      {errors.lineItems?.[idx]?.quantity && (
                        <p className="text-red-500 text-sm">
                          {errors.lineItems[idx].quantity.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Line Total & Remove */}
                  <div className="flex justify-between items-center">
                    <Input
                      readOnly
                      value={total ? `$${total}` : ""}
                      className="bg-gray-100"
                    />
                    <Button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white"
                      onClick={() => remove(idx)}
                    >
                      Remove Item
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button type="button" className="bg-green-500 hover:bg-green-600 text-white px-6 py-2" onClick={() => append(defaultLineItem)}>
              Add Line Item
            </Button>
          </div>

          {/* Grand Total */}
          <div className="mb-8">
            <label className="block font-medium mb-1">Grand Total</label>
            <Input
              readOnly
              value={grandTotal ? `$${grandTotal.toFixed(2)}` : ""}
              className="bg-gray-100"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Button type="button" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3" onClick={() => reset(blankExpense)}>
              Clear Form
            </Button>
            <Button type="button" className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
});

export default ExpenseForm;
