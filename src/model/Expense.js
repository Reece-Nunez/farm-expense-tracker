import { z } from "zod";
import { expenseSchema } from "@/schemas/expenseSchema";

export const Expense = {
  name: "Expense",
  fields: {
    id: { type: "ID", required: true },
    date: { type: "AWSDate", required: true },
    category: { type: "String", required: true },
    item: { type: "String", required: true },
    vendor: { type: "String", required: true },
    quantity: { type: "Int", required: true },
    unitCost: { type: "Float", required: true },
    totalCost: { type: "Float", required: true },
    description: { type: "String" },
    userID: { type: "ID", required: true },
  },
  syncable: true,
  pluralName: "Expenses",
  attributes: [
    { type: "model" },
    { type: "auth", properties: { rules: [{ allow: "owner" }] } },
  ],
};
