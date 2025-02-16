import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { incomeSchema } from "@/schemas/incomeSchema";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const paymentMethods = ["Venmo", "Checks", "Cash", "Other"];
const itemsSold = ["Eggs", "Beef", "Pork", "Other"];

export default function IncomeForm() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(incomeSchema)
  });

  const item = watch("itemSold");
  const price = watch("pricePerUnit");
  const quantity = watch("weightOrQuantity");
  const total = price && quantity ? (price * quantity).toFixed(2) : "";

  return (
    <Card className="max-w-4xl mx-auto p-6">
      <CardHeader className="text-2xl font-bold mb-4">Income Form</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((data) => console.log(data))}>
          <Select {...register("paymentMethod")}>
            <option value="">Select Payment Method</option>
            {paymentMethods.map((method) => <option key={method}>{method}</option>)}
          </Select>
          <Select {...register("itemSold")}>
            <option value="">Select Item Sold</option>
            {itemsSold.map((item) => <option key={item}>{item}</option>)}
          </Select>
          {item && item !== "Other" && (
            <Input
              {...register("weightOrQuantity")}
              placeholder={item === "Eggs" ? "Enter dozens (e.g., 1 or 0.5)" : "Enter weight in pounds"}
              type="number"
              step="0.01"
            />
          )}
          <Input {...register("pricePerUnit")} placeholder="Price per unit" type="number" step="0.01" />
          <Input readOnly value={total ? `$${total}` : ""} placeholder="Total" />
          <Input {...register("date")} type="date" />
          <Input {...register("description")} placeholder="Description (optional)" />
          <Button type="submit" className="mt-4">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}
