import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export const Expense = {
  name: "Expense",
  fields: {
    id: { type: "ID", isRequired: true },
    date: { type: "AWSDate", isRequired: true },
    unitCost: { type: "Float", isRequired: true },
    quantity: { type: "Int", isRequired: true },
    totalCost: { type: "Float", isRequired: true },
    category: { type: "String", isRequired: true },
    item: { type: "String", isRequired: true },
    vendor: { type: "String", isRequired: true },
    description: { type: "String", isRequired: false },
  },
  syncable: true,
  pluralName: "Expenses",
  attributes: [
    { type: "model", properties: {} },
    { type: "auth", properties: { rules: [{ allow: "owner" }] } },
  ],
};

export const schema = {
  models: {
    Expense,
  },
  version: "1.0",
};
