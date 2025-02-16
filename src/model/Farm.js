import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export const Farm = {
    name: "Farm",
    fields: {
      id: { type: "ID", required: true },
      name: { type: "String", required: true },
      location: { type: "String" },
      ownerID: { type: "ID", required: true },
      expenses: { type: "[Expense]" },
      incomes: { type: "[Income]" }
    },
    syncable: true,
    pluralName: "Farms",
    attributes: [{ type: "model" }, { type: "auth", properties: { rules: [{ allow: "owner" }] } }]
  };
  