
export const Income = {
    name: "Income",
    fields: {
      id: { type: "ID", required: true },
      date: { type: "AWSDate", required: true },
      amount: { type: "Float", required: true },
      description: { type: "String" },
      item: { type: "String", required: true},
      userID: { type: "ID", required: true }
    },
    syncable: true,
    pluralName: "Incomes",
    attributes: [{ type: "model" }, { type: "auth", properties: { rules: [{ allow: "owner" }] } }]
  };