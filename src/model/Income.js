import { ModelInit, MutableModel } from "@aws-amplify/datastore";

export const Income = {
    name: "Income",
    fields: {
      id: { type: "ID", isRequired: true },
      date: { type: "AWSDate", isRequired: true },
      amount: { type: "Float", isRequired: true },
      source: { type: "String", isRequired: true },
      description: { type: "String", isRequired: false }
    },
    syncable: true,
    pluralName: "Incomes",
    attributes: [
      { type: "model", properties: {} },
      { type: "auth", properties: { rules: [{ allow: "owner" }] } }
    ]
  };
  
  export const schema = {
    models: {
      Expense,
      Income
    },
    version: "1.0"
  };