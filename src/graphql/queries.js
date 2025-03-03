/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      expenses {
        nextToken
        startedAt
        __typename
      }
      income {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      __typename
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        username
        email
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getExpense = /* GraphQL */ `
  query GetExpense($id: ID!) {
    getExpense(id: $id) {
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
      receiptImageKey
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userExpensesId
      owner
      __typename
    }
  }
`;
export const listExpenses = /* GraphQL */ `
  query ListExpenses(
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listExpenses(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        receiptImageKey
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userExpensesId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncExpenses = /* GraphQL */ `
  query SyncExpenses(
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncExpenses(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
        receiptImageKey
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userExpensesId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getIncome = /* GraphQL */ `
  query GetIncome($id: ID!) {
    getIncome(id: $id) {
      id
      userId
      date
      source
      amount
      notes
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userIncomeId
      owner
      __typename
    }
  }
`;
export const listIncomes = /* GraphQL */ `
  query ListIncomes(
    $filter: ModelIncomeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIncomes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        date
        source
        amount
        notes
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userIncomeId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncIncomes = /* GraphQL */ `
  query SyncIncomes(
    $filter: ModelIncomeFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncIncomes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        userId
        date
        source
        amount
        notes
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userIncomeId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const expensesByUserId = /* GraphQL */ `
  query ExpensesByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelExpenseFilterInput
    $limit: Int
    $nextToken: String
  ) {
    expensesByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        receiptImageKey
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userExpensesId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const incomesByUserId = /* GraphQL */ `
  query IncomesByUserId(
    $userId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelIncomeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    incomesByUserId(
      userId: $userId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        userId
        date
        source
        amount
        notes
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        userIncomeId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
