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
