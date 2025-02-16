import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { incomeSchema } from "@/schemas/incomeSchema";

const paymentMethods = ["Venmo", "Checks", "Cash", "Other"];
const itemsSold = ["Eggs", "Beef", "Pork", "Other"];

export default function IncomeForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(incomeSchema)
  });

  const onSubmit = (data) => {
    console.log("Income data submitted:", data);
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 mb-6">
      <CardHeader className="text-2xl font-bold text-center">Income Form</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Payment Method</label>
            <Select {...register("paymentMethod")}> 
              {paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}
            </Select>
            {errors.paymentMethod && <p className="text-red-500">{errors.paymentMethod.message}</p>}
          </div>

          <div>
            <label>Item Sold</label>
            <Select {...register("itemSold")}>
              {itemsSold.map((item) => <option key={item} value={item}>{item}</option>)}
            </Select>
            {errors.itemSold && <p className="text-red-500">{errors.itemSold.message}</p>}
          </div>

          <div>
            <label>Amount</label>
            <Input type="number" {...register("amount")} />
            {errors.amount && <p className="text-red-500">{errors.amount.message}</p>}
          </div>

          <Button type="submit" className="w-full bg-green-500">Submit</Button>
        </form>
      </CardContent>
    </Card>
  );
}