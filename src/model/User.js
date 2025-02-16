import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export const User = {
    name: "User",
    fields: {
      id: { type: "ID", required: true },
      username: { type: "String", required: true },
      email: { type: "AWSEmail", required: true },
      farms: { type: "[Farm]" },
      expenses: { type: "[Expense]" },
      incomes: { type: "[Income]" }
    },
    syncable: true,
    pluralName: "Users",
    attributes: [{ type: "model" }, { type: "auth", properties: { rules: [{ allow: "owner" }] } }]
  };