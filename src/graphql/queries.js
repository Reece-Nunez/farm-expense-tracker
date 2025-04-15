/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      sub
      username
      email
      farmName
      phone
      aboutMe
      profilePictureKey
      role
      preferences
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
        sub
        username
        email
        farmName
        phone
        aboutMe
        profilePictureKey
        role
        preferences
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getExpense = /* GraphQL */ `
  query GetExpense($id: ID!) {
    getExpense(id: $id) {
      id
      sub
      userId
      date
      vendor
      grandTotal
      description
      receiptImageKey
      lineItems {
        nextToken
        __typename
      }
      user {
        id
        sub
        username
        email
        farmName
        phone
        aboutMe
        profilePictureKey
        role
        preferences
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
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
        sub
        userId
        date
        vendor
        grandTotal
        description
        receiptImageKey
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLineItem = /* GraphQL */ `
  query GetLineItem($id: ID!) {
    getLineItem(id: $id) {
      id
      sub
      expenseID
      expense {
        id
        sub
        userId
        date
        vendor
        grandTotal
        description
        receiptImageKey
        createdAt
        updatedAt
        __typename
      }
      item
      category
      quantity
      unitCost
      lineTotal
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLineItems = /* GraphQL */ `
  query ListLineItems(
    $filter: ModelLineItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLineItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        expenseID
        item
        category
        quantity
        unitCost
        lineTotal
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getIncome = /* GraphQL */ `
  query GetIncome($id: ID!) {
    getIncome(id: $id) {
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
      user {
        id
        sub
        username
        email
        farmName
        phone
        aboutMe
        profilePictureKey
        role
        preferences
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
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
        sub
        userId
        date
        quantity
        price
        paymentMethod
        amount
        item
        notes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getField = /* GraphQL */ `
  query GetField($id: ID!) {
    getField(id: $id) {
      id
      sub
      name
      acres
      notes
      livestock {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listFields = /* GraphQL */ `
  query ListFields(
    $filter: ModelFieldFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFields(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        name
        acres
        notes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLivestock = /* GraphQL */ `
  query GetLivestock($id: ID!) {
    getLivestock(id: $id) {
      id
      sub
      name
      species
      breed
      birthdate
      weight
      gender
      status
      fieldID
      location {
        id
        sub
        name
        acres
        notes
        createdAt
        updatedAt
        __typename
      }
      parents {
        nextToken
        __typename
      }
      children {
        nextToken
        __typename
      }
      medicalRecords {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLivestocks = /* GraphQL */ `
  query ListLivestocks(
    $filter: ModelLivestockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLivestocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        name
        species
        breed
        birthdate
        weight
        gender
        status
        fieldID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getLivestockFamily = /* GraphQL */ `
  query GetLivestockFamily($id: ID!) {
    getLivestockFamily(id: $id) {
      id
      sub
      parentID
      childID
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listLivestockFamilies = /* GraphQL */ `
  query ListLivestockFamilies(
    $filter: ModelLivestockFamilyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLivestockFamilies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        parentID
        childID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getMedicalRecord = /* GraphQL */ `
  query GetMedicalRecord($id: ID!) {
    getMedicalRecord(id: $id) {
      id
      sub
      livestockID
      type
      notes
      date
      medicine
      livestock {
        id
        sub
        name
        species
        breed
        birthdate
        weight
        gender
        status
        fieldID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      livestockMedicalRecordsId
      __typename
    }
  }
`;
export const listMedicalRecords = /* GraphQL */ `
  query ListMedicalRecords(
    $filter: ModelMedicalRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMedicalRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        livestockID
        type
        notes
        date
        medicine
        createdAt
        updatedAt
        livestockMedicalRecordsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getChickenFlock = /* GraphQL */ `
  query GetChickenFlock($id: ID!) {
    getChickenFlock(id: $id) {
      id
      sub
      breed
      count
      hasRooster
      eggLogs {
        nextToken
        __typename
      }
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listChickenFlocks = /* GraphQL */ `
  query ListChickenFlocks(
    $filter: ModelChickenFlockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChickenFlocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        breed
        count
        hasRooster
        notes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getEggLog = /* GraphQL */ `
  query GetEggLog($id: ID!) {
    getEggLog(id: $id) {
      id
      sub
      date
      eggsCollected
      chickenFlockID
      createdAt
      updatedAt
      chickenFlockEggLogsId
      __typename
    }
  }
`;
export const listEggLogs = /* GraphQL */ `
  query ListEggLogs(
    $filter: ModelEggLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEggLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        date
        eggsCollected
        chickenFlockID
        createdAt
        updatedAt
        chickenFlockEggLogsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getInventoryItem = /* GraphQL */ `
  query GetInventoryItem($id: ID!) {
    getInventoryItem(id: $id) {
      id
      sub
      name
      type
      quantity
      location
      acquiredDate
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const listInventoryItems = /* GraphQL */ `
  query ListInventoryItems(
    $filter: ModelInventoryItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInventoryItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        name
        type
        quantity
        location
        acquiredDate
        notes
        createdAt
        updatedAt
        __typename
      }
      nextToken
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
        sub
        userId
        date
        vendor
        grandTotal
        description
        receiptImageKey
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const lineItemsByExpenseID = /* GraphQL */ `
  query LineItemsByExpenseID(
    $expenseID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLineItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    lineItemsByExpenseID(
      expenseID: $expenseID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        expenseID
        item
        category
        quantity
        unitCost
        lineTotal
        createdAt
        updatedAt
        __typename
      }
      nextToken
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
        sub
        userId
        date
        quantity
        price
        paymentMethod
        amount
        item
        notes
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const livestocksByFieldID = /* GraphQL */ `
  query LivestocksByFieldID(
    $fieldID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLivestockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    livestocksByFieldID(
      fieldID: $fieldID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        name
        species
        breed
        birthdate
        weight
        gender
        status
        fieldID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const livestockFamiliesByParentID = /* GraphQL */ `
  query LivestockFamiliesByParentID(
    $parentID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLivestockFamilyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    livestockFamiliesByParentID(
      parentID: $parentID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        parentID
        childID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const livestockFamiliesByChildID = /* GraphQL */ `
  query LivestockFamiliesByChildID(
    $childID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelLivestockFamilyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    livestockFamiliesByChildID(
      childID: $childID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        parentID
        childID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const medicalRecordsByLivestockID = /* GraphQL */ `
  query MedicalRecordsByLivestockID(
    $livestockID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelMedicalRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    medicalRecordsByLivestockID(
      livestockID: $livestockID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        livestockID
        type
        notes
        date
        medicine
        createdAt
        updatedAt
        livestockMedicalRecordsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const eggLogsByChickenFlockID = /* GraphQL */ `
  query EggLogsByChickenFlockID(
    $chickenFlockID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelEggLogFilterInput
    $limit: Int
    $nextToken: String
  ) {
    eggLogsByChickenFlockID(
      chickenFlockID: $chickenFlockID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        date
        eggsCollected
        chickenFlockID
        createdAt
        updatedAt
        chickenFlockEggLogsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
