export const LIST_EXPENSES_WITH_LINE_ITEMS = /* GraphQL */ `
  query ListExpenses(
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        vendor
        grandTotal
        userId
        sub
        lineItems {
          items {
            id
            item
            category
            quantity
            unitCost
            lineTotal
          }
        }
      }
      nextToken
    }
  }
`;

export const listIncomesWithLivestock = /* GraphQL */ `
  query ListIncomesWithLivestock(
    $filter: ModelIncomeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIncomes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        userId
        date
        quantity
        price
        paymentMethod
        amount
        item
        notes
        livestockID
        livestock {
          id
          name
          species
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;

