import { z } from "zod";

export const expenseSchema = z.object({
  // We coerce date from string to JS Date
  date: z.coerce.date({
    required_error: "Date is required",
  }),
  // unitCost can be string or number; z.coerce.number() handles both
  unitCost: z.coerce.number().gt(0, "Unit Cost must be greater than 0"),
  // quantity is coerced from string, must be > 0
  quantity: z.coerce.number().gt(0, "Quantity must be greater than 0"),
  // category, item, vendor are non-empty strings
  category: z.string().min(1, "Category is required"),
  item: z.string().min(1, "Item is required"),
  vendor: z.string().min(1, "Vendor is required"),
  // description is optional
  description: z.string().optional(),
  receiptFile: z.any().optional(),
});
