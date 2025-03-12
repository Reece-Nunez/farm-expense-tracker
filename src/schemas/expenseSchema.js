import { z } from "zod";

// Each individual line item
const lineItemSchema = z.object({
  item: z.string().min(1, "Item is required"),
  category: z.string().min(1, "Category is required"),
  // coerce number so strings become numbers
  unitCost: z.coerce.number().gt(0, "Unit Cost must be greater than 0"),
  quantity: z.coerce.number().gt(0, "Quantity must be greater than 0"),
});

// The parent "expense" object with top-level fields and a nested array of lineItems
export const expenseFormSchema = z.object({
  // This top-level date is the overall "expense date"
  date: z.coerce.date({
    required_error: "Date is required",
  }),
  vendor: z.string().min(1, "Vendor is required"),
  // description is optional
  description: z.string().optional(),
  // receiptFile is optional
  receiptFile: z.any().optional(),

  // lineItems: an array with the shape above
  lineItems: z
    .array(lineItemSchema)
    .min(1, "At least one line item is required"),
});
