import { z } from "zod";

export const incomeSchema = z.object({
  date: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) =>
      !val ? undefined : val instanceof Date ? val : new Date(val),
    ),

  paymentMethod: z.string().min(1, "Payment method is required"),

  item: z.enum(["Eggs", "Beef", "Pork", "Animal", "Other"], {
    errorMap: () => ({ message: "Invalid item sold" }),
  }),

  weightOrQuantity: z
    .coerce
    .number({ required_error: "Weight is required", invalid_type_error: "Expected number" })
    .positive("Weight must be ≥ 0"),

  pricePerUnit: z
    .coerce
    .number({ required_error: "Price is required", invalid_type_error: "Expected number" })
    .nonnegative("Price must be ≥ 0"),

  total: z
    .union([z.string(), z.number()])
    .transform((val) =>
      typeof val === "string" ? parseFloat(val.replace(/[^\d.-]/g, "")) : val,
    )
    .refine((n) => !Number.isNaN(n) && n > 0, "Total must be ≥ 0")
    .optional(),

  description: z.string().optional(),

   livestockID: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});
