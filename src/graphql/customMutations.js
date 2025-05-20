export const createIncomeWithLivestock = /* GraphQL */ `
  mutation CreateIncome($input: CreateIncomeInput!) {
    createIncome(input: $input) {
      id
      item
      amount
      livestockID
      date
      paymentMethod
      price
      quantity
      sub
      userId
    }
  }
`;


export const deleteIncomeSafe = /* GraphQL */ `
  mutation DeleteIncome($input: DeleteIncomeInput!) {
    deleteIncome(input: $input) {
      id
      livestockID  # just return the ID, skip the full relation
    }
  }
`;

export const updateLivestockStatus = /* GraphQL */ `
  mutation UpdateLivestock($input: UpdateLivestockInput!) {
    updateLivestock(input: $input) {
      id
      status
    }
  }
`;
