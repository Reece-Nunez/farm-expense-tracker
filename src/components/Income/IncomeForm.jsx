import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCurrentUser } from "../../utils/getCurrentUser";
import { generateClient } from "aws-amplify/api";
import { listLivestocks } from "../../graphql/queries";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CurrencyInput from "react-currency-input-field";
import { updateLivestockStatus } from "../../graphql/customMutations";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Controller } from "react-hook-form";
import { createIncome } from "@/graphql/mutations"; // full version with livestock
import { createIncomeWithLivestock } from "@/graphql/customMutations"; // trimmed version
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { incomeSchema } from "@/schemas/incomeSchema";
import { CalendarIcon } from "@heroicons/react/outline";

const paymentMethods = ["Venmo", "Checks", "Cash", "Other"];
const itemsSold = ["Eggs", "Beef", "Pork", "Animal", "Other"];

const IncomeForm = forwardRef((props, ref) => {
  const client = generateClient();
  const [soldAnimals, setSoldAnimals] = useState([]);
  const [livestockOptions, setLivestockOptions] = useState([]);
  const { onValidSubmit, editingIncome } = props;
  const [lastEditedField, setLastEditedField] = useState(null);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      date: "",
      pricePerUnit: "",
      weightOrQuantity: "",
      livestockID: "",
      item: "",
      paymentMethod: "",
      notes: "",
      total: "",
    },
  });

  useEffect(() => {
    register("livestockID");
  }, [register]);

  useEffect(() => {
    const total = parseFloat(watch("total") || "0");
    const price = parseFloat(watch("pricePerUnit") || "0");
    const quantity = parseFloat(watch("weightOrQuantity") || "0");

    if (lastEditedField === "total" && quantity > 0) {
      setValue("pricePerUnit", (total / quantity).toFixed(2));
    } else if (lastEditedField === "pricePerUnit" && quantity > 0) {
      setValue("total", (price * quantity).toFixed(2));
    }
  }, [
    watch("total"),
    watch("pricePerUnit"),
    watch("weightOrQuantity"),
    setValue,
    lastEditedField,
  ]);

  useImperativeHandle(ref, () => ({
    resetForm: () => reset(),
  }));

  useEffect(() => {
    const fetchLivestock = async () => {
      const user = await getCurrentUser();
      const client = generateClient();
      try {
        const { data } = await client.graphql({
          query: listLivestocks,
          variables: {
            filter: {
              sub: { eq: user.sub },
              status: { eq: "Active" },
            },
            limit: 1000,
          },
        });

        console.log("[Available Livestock]", data.listLivestocks.items); // 🔍 Log results\
        console.log("Raw livestock data:", data.listLivestocks.items);

        setLivestockOptions(data.listLivestocks.items);
      } catch (err) {
        console.error("❌ Error fetching available livestock:", err);
      }
    };

    fetchLivestock();
  }, []);

  useEffect(() => {
    const fetchSoldLivestock = async () => {
      const user = await getCurrentUser();
      const { data } = await client.graphql({
        query: listLivestocks,
        variables: {
          filter: {
            sub: { eq: user.sub },
            status: { eq: "Sold" },
          },
          limit: 1000,
        },
      });
      setSoldAnimals(data.listLivestocks.items);
    };
    fetchSoldLivestock();
  }, []);

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

  const watchItem = watch("item");
  const watchDate = watch("date");
  const watchPricePerUnit = watch("pricePerUnit");
  const watchWeightOrQuantity = parseFloat(watch("weightOrQuantity")) || 0;
  const watchTotal = parseFloat(watch("total") || "0");
  const activeField =
    lastEditedField === "total"
      ? "total"
      : lastEditedField === "pricePerUnit"
      ? "pricePerUnit"
      : null;

  const amount =
    watchTotal ||
    parseFloat(watchPricePerUnit || "0") * watchWeightOrQuantity ||
    0;

  const navigate = useNavigate();

  const onValid = async (data) => {
    const dateValue = data.date ? new Date(data.date) : null;
    const isoDate = dateValue ? dateValue.toISOString().split("T")[0] : "";
    const parsedQuantity = parseFloat(data.weightOrQuantity || "0");
    const parsedPrice = data.total
      ? parseFloat(data.total || "0") / parsedQuantity
      : parseFloat(data.pricePerUnit || "0");

    const computedAmount = parsedPrice * parsedQuantity;

    const currentUser = await getCurrentUser();

    const finalObj = {
      date: isoDate,
      paymentMethod: data.paymentMethod,
      item: data.item || "Other",
      quantity: Math.round(parsedQuantity),
      price: parsedPrice,
      amount: parseFloat(computedAmount.toFixed(2)),
      notes: data.notes || "",
      livestockID:
        data.livestockID?.trim?.() === "" ? undefined : data.livestockID,
      sub: currentUser.sub,
      userId: currentUser.id,
    };

    console.log("📦 Form livestockID:", data.livestockID);
    console.log("[🧾 Submitting Income]:", finalObj);
    console.log("🐮 Raw form data:", data);

    try {
      const mutation = finalObj.livestockID
        ? createIncomeWithLivestock
        : createIncome;

      const { data: result } = await client.graphql({
        query: mutation,
        variables: { input: finalObj },
      });

      console.log("✅ Income created:", result);

      // 🐄 Update livestock status if linked
      if (finalObj.livestockID) {
        try {
          await client.graphql({
            query: updateLivestockStatus,
            variables: {
              input: {
                id: finalObj.livestockID,
                status: "Sold",
              },
            },
          });
          toast.success("Animal status updated to Sold.");
        } catch (livestockErr) {
          console.error("❌ Failed to update livestock status:", livestockErr);
          toast.error("Income saved, but failed to mark animal as Sold.");
        }
      }

      toast.success("Income successfully logged.");
      reset();
      setLastEditedField(null);
    } catch (err) {
      console.error("❌ Error creating income:", err);
      toast.error("Failed to log income. Check the console for details.");
    }
  };

  const onInvalid = (formErrors) => {
    console.log("[IncomeForm] Validation errors:", formErrors);
    toast.error("Please fix errors before submitting.");
  };

  const handleDateChange = (date) => {
    setValue("date", date || "");
  };

  const handlePriceChange = (val) => {
    setLastEditedField("pricePerUnit");
    setValue("pricePerUnit", val || "");
  };

  const handleTotalChange = (val) => {
    setLastEditedField("total");
    setValue("total", val || "");
  };

  return (
    <Card className="w-full max-w-md md:max-w-4xl mx-auto p-4 md:p-8 mb-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader className="text-2xl md:text-3xl font-bold text-center mb-4">
        Income Form
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-4">
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
            {watchItem === "Animal" && (
              <div className="mt-4">
                <label className="block font-medium mb-2">
                  Linked Animal (Optional)
                </label>
                <Controller
                  name="livestockID"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="">Select Animal</option>
                      {livestockOptions.map((animal) => (
                        <option key={animal.id} value={animal.id}>
                          {animal.name} ({animal.species})
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            )}

            {errors.item && (
              <p className="text-red-500 text-sm mt-1">{errors.item.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Weight/Quantity</label>
              <Input
                type="number"
                step="any"
                placeholder="e.g., 12 (dozens) or 50 (lbs)"
                {...register("weightOrQuantity", { valueAsNumber: true })}
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
              {lastEditedField === "total" && (
                <p className="text-xs text-gray-500 mt-1 italic">
                  Auto-calculated from total / quantity
                </p>
              )}
            </div>
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">Total Amount</label>
            <CurrencyInput
              prefix="$"
              decimalsLimit={2}
              decimalScale={2}
              allowNegativeValue={false}
              placeholder="Total amount"
              value={watch("total")}
              onValueChange={handleTotalChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            {lastEditedField === "pricePerUnit" && (
              <p className="text-xs text-gray-500 mt-1 italic">
                Auto-calculated from price × quantity
              </p>
            )}
          </div>

          <div>
            <label className="block font-medium mb-1">Notes (Optional)</label>
            <Textarea
              placeholder="Any extra details"
              {...register("notes")}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>

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
