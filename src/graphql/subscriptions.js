/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
      id
      username
      email
      expenses {
        nextToken
        __typename
      }
      income {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
      id
      username
      email
      expenses {
        nextToken
        __typename
      }
      income {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
      id
      username
      email
      expenses {
        nextToken
        __typename
      }
      income {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $owner: String
  ) {
    onCreateExpense(filter: $filter, owner: $owner) {
      id
      userId
      date
      category
      item
      vendor
      unitCost
      quantity
      totalCost
      description
      createdAt
      updatedAt
      userExpensesId
      owner
      __typename
    }
  }
`;
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $owner: String
  ) {
    onUpdateExpense(filter: $filter, owner: $owner) {
      id
      userId
      date
      category
      item
      vendor
      unitCost
      quantity
      totalCost
      description
      createdAt
      updatedAt
      userExpensesId
      owner
      __typename
    }
  }
`;
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $owner: String
  ) {
    onDeleteExpense(filter: $filter, owner: $owner) {
      id
      userId
      date
      category
      item
      vendor
      unitCost
      quantity
      totalCost
      description
      createdAt
      updatedAt
      userExpensesId
      owner
      __typename
    }
  }
`;
export const onCreateIncome = /* GraphQL */ `
  subscription OnCreateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $owner: String
  ) {
    onCreateIncome(filter: $filter, owner: $owner) {
      id
      userId
      date
      source
      amount
      notes
      createdAt
      updatedAt
      userIncomeId
      owner
      __typename
    }
  }
`;
export const onUpdateIncome = /* GraphQL */ `
  subscription OnUpdateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $owner: String
  ) {
    onUpdateIncome(filter: $filter, owner: $owner) {
      id
      userId
      date
      source
      amount
      notes
      createdAt
      updatedAt
      userIncomeId
      owner
      __typename
    }
  }
`;
export const onDeleteIncome = /* GraphQL */ `
  subscription OnDeleteIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $owner: String
  ) {
    onDeleteIncome(filter: $filter, owner: $owner) {
      id
      userId
      date
      source
      amount
      notes
      createdAt
      updatedAt
      userIncomeId
      owner
      __typename
    }
  }
`;
