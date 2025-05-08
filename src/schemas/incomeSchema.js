import { z } from "zod";

export const incomeSchema = z.object({
  // If date is stored as a string, transform it to a JS Date
  date: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (val instanceof Date) return val; // already a Date
      return new Date(val); // convert string -> Date
    }),

  paymentMethod: z.string().min(1, "Payment method is required"),

  item: z.enum(["Eggs", "Beef", "Pork", "Animal", "Other"], {
    errorMap: () => ({ message: "Invalid item sold" }),
  }),

  weightOrQuantity: z.number().min(0.01, "Weight must be > 0"),

  pricePerUnit: z
    .string()
    // Same transform for currency input
    .transform((val) => parseFloat(val.replace(/[^\d.-]/g, "")))
    .refine((num) => !Number.isNaN(num) && num > 0, "Price must be > 0"),

  total: z
    .string()
    // Same transform for currency input
    .transform((val) => parseFloat(val.replace(/[^\d.-]/g, "")))
    .refine((num) => !Number.isNaN(num) && num > 0, "Total must be > 0")
    .optional(),

  description: z.string().optional(),
});
