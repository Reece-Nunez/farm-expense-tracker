import { z } from "zod";

export const incomeSchema = z.object({
  paymentMethod: z.string().min(1, "Payment method is required"),
  itemSold: z.enum(["Eggs", "Beef", "Pork", "Other"], "Invalid item sold"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  weightOrQuantity: z.union([
    z.number().min(0.01, "Weight must be greater than 0").optional(),
    z.number().min(0.5, "Quantity must be at least half a dozen").optional()
  ]).optional(),
  pricePerUnit: z.number().min(0.01, "Price must be greater than 0"),
  total: z.number().min(0.01, "Total must be greater than 0"),
  date: z.date().optional(),
  description: z.string().optional()
});