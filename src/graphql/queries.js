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
      owner
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
        owner
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
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
        sub
        username
        email
        farmName
        phone
        aboutMe
        profilePictureKey
        role
        preferences
        owner
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
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
      vendor
      grandTotal
      description
      receiptImageKey
      lineItems {
        category
        item
        unitCost
        quantity
        lineTotal
        __typename
      }
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
        vendor
        grandTotal
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
        vendor
        grandTotal
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
      quantity
      price
      paymentMethod
      amount
      item
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
        quantity
        price
        paymentMethod
        amount
        item
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
        quantity
        price
        paymentMethod
        amount
        item
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
export const getField = /* GraphQL */ `
  query GetField($id: ID!) {
    getField(id: $id) {
      id
      name
      acres
      notes
      livestock {
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
export const listFields = /* GraphQL */ `
  query ListFields(
    $filter: ModelFieldFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFields(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        acres
        notes
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
export const syncFields = /* GraphQL */ `
  query SyncFields(
    $filter: ModelFieldFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncFields(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        acres
        notes
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
export const getLivestock = /* GraphQL */ `
  query GetLivestock($id: ID!) {
    getLivestock(id: $id) {
      id
      name
      species
      breed
      birthdate
      weight
      gender
      fieldID
      location {
        id
        name
        acres
        notes
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
        __typename
      }
      parents {
        nextToken
        startedAt
        __typename
      }
      children {
        nextToken
        startedAt
        __typename
      }
      medicalRecords {
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
export const listLivestocks = /* GraphQL */ `
  query ListLivestocks(
    $filter: ModelLivestockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listLivestocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        species
        breed
        birthdate
        weight
        gender
        fieldID
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
export const syncLivestocks = /* GraphQL */ `
  query SyncLivestocks(
    $filter: ModelLivestockFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLivestocks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        species
        breed
        birthdate
        weight
        gender
        fieldID
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
export const getLivestockFamily = /* GraphQL */ `
  query GetLivestockFamily($id: ID!) {
    getLivestockFamily(id: $id) {
      id
      parentID
      childID
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
        parentID
        childID
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
export const syncLivestockFamilies = /* GraphQL */ `
  query SyncLivestockFamilies(
    $filter: ModelLivestockFamilyFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncLivestockFamilies(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        parentID
        childID
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
export const getMedicalRecord = /* GraphQL */ `
  query GetMedicalRecord($id: ID!) {
    getMedicalRecord(id: $id) {
      id
      livestockID
      type
      notes
      date
      medicine
      livestock {
        id
        name
        species
        breed
        birthdate
        weight
        gender
        fieldID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      livestockMedicalRecordsId
      owner
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
        livestockID
        type
        notes
        date
        medicine
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        livestockMedicalRecordsId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncMedicalRecords = /* GraphQL */ `
  query SyncMedicalRecords(
    $filter: ModelMedicalRecordFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncMedicalRecords(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        livestockID
        type
        notes
        date
        medicine
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        livestockMedicalRecordsId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getChickenFlock = /* GraphQL */ `
  query GetChickenFlock($id: ID!) {
    getChickenFlock(id: $id) {
      id
      breed
      count
      hasRooster
      eggLogs {
        nextToken
        startedAt
        __typename
      }
      notes
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
export const listChickenFlocks = /* GraphQL */ `
  query ListChickenFlocks(
    $filter: ModelChickenFlockFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChickenFlocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        breed
        count
        hasRooster
        notes
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
export const syncChickenFlocks = /* GraphQL */ `
  query SyncChickenFlocks(
    $filter: ModelChickenFlockFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncChickenFlocks(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        breed
        count
        hasRooster
        notes
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
export const getEggLog = /* GraphQL */ `
  query GetEggLog($id: ID!) {
    getEggLog(id: $id) {
      id
      date
      eggsCollected
      chickenFlockID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      chickenFlockEggLogsId
      owner
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
        date
        eggsCollected
        chickenFlockID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        chickenFlockEggLogsId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncEggLogs = /* GraphQL */ `
  query SyncEggLogs(
    $filter: ModelEggLogFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncEggLogs(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        date
        eggsCollected
        chickenFlockID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        chickenFlockEggLogsId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getInventoryItem = /* GraphQL */ `
  query GetInventoryItem($id: ID!) {
    getInventoryItem(id: $id) {
      id
      name
      type
      quantity
      location
      acquiredDate
      notes
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
export const listInventoryItems = /* GraphQL */ `
  query ListInventoryItems(
    $filter: ModelInventoryItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInventoryItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        type
        quantity
        location
        acquiredDate
        notes
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
export const syncInventoryItems = /* GraphQL */ `
  query SyncInventoryItems(
    $filter: ModelInventoryItemFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncInventoryItems(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        type
        quantity
        location
        acquiredDate
        notes
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
        vendor
        grandTotal
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
        quantity
        price
        paymentMethod
        amount
        item
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
        name
        species
        breed
        birthdate
        weight
        gender
        fieldID
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
        parentID
        childID
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
        parentID
        childID
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
        livestockID
        type
        notes
        date
        medicine
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        livestockMedicalRecordsId
        owner
        __typename
      }
      nextToken
      startedAt
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
        date
        eggsCollected
        chickenFlockID
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        chickenFlockEggLogsId
        owner
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
