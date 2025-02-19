import { z } from "zod";
import { expenseSchema } from "@/schemas/expenseSchema";

export const expenseFormSchema = z.object({
  expenses: z.array(expenseSchema),
});