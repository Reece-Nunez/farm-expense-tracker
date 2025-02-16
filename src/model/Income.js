import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export const Income = {
    name: "Income",
    fields: {
      id: { type: "ID", required: true },
      date: { type: "AWSDate", required: true },
      source: { type: "String", required: true },
      amount: { type: "Float", required: true },
      description: { type: "String" },
      userID: { type: "ID", required: true }
    },
    syncable: true,
    pluralName: "Incomes",
    attributes: [{ type: "model" }, { type: "auth", properties: { rules: [{ allow: "owner" }] } }]
  };