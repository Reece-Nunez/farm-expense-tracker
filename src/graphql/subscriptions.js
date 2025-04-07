/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $userId: String
  ) {
    onCreateUser(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $userId: String
  ) {
    onUpdateUser(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $userId: String
  ) {
    onDeleteUser(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $userId: String
  ) {
    onCreateExpense(filter: $filter, userId: $userId) {
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
      __typename
    }
  }
`;
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $userId: String
  ) {
    onUpdateExpense(filter: $filter, userId: $userId) {
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
      __typename
    }
  }
`;
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $userId: String
  ) {
    onDeleteExpense(filter: $filter, userId: $userId) {
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
      __typename
    }
  }
`;
export const onCreateIncome = /* GraphQL */ `
  subscription OnCreateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $userId: String
  ) {
    onCreateIncome(filter: $filter, userId: $userId) {
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
      __typename
    }
  }
`;
export const onUpdateIncome = /* GraphQL */ `
  subscription OnUpdateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $userId: String
  ) {
    onUpdateIncome(filter: $filter, userId: $userId) {
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
      __typename
    }
  }
`;
export const onDeleteIncome = /* GraphQL */ `
  subscription OnDeleteIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $userId: String
  ) {
    onDeleteIncome(filter: $filter, userId: $userId) {
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
      __typename
    }
  }
`;
export const onCreateField = /* GraphQL */ `
  subscription OnCreateField(
    $filter: ModelSubscriptionFieldFilterInput
    $userId: String
  ) {
    onCreateField(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onUpdateField = /* GraphQL */ `
  subscription OnUpdateField(
    $filter: ModelSubscriptionFieldFilterInput
    $userId: String
  ) {
    onUpdateField(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onDeleteField = /* GraphQL */ `
  subscription OnDeleteField(
    $filter: ModelSubscriptionFieldFilterInput
    $userId: String
  ) {
    onDeleteField(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onCreateLivestock = /* GraphQL */ `
  subscription OnCreateLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $userId: String
  ) {
    onCreateLivestock(filter: $filter, userId: $userId) {
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
        userId
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
      userId
      __typename
    }
  }
`;
export const onUpdateLivestock = /* GraphQL */ `
  subscription OnUpdateLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $userId: String
  ) {
    onUpdateLivestock(filter: $filter, userId: $userId) {
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
        userId
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
      userId
      __typename
    }
  }
`;
export const onDeleteLivestock = /* GraphQL */ `
  subscription OnDeleteLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $userId: String
  ) {
    onDeleteLivestock(filter: $filter, userId: $userId) {
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
        userId
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
      userId
      __typename
    }
  }
`;
export const onCreateLivestockFamily = /* GraphQL */ `
  subscription OnCreateLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $userId: String
  ) {
    onCreateLivestockFamily(filter: $filter, userId: $userId) {
      id
      parentID
      childID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userId
      __typename
    }
  }
`;
export const onUpdateLivestockFamily = /* GraphQL */ `
  subscription OnUpdateLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $userId: String
  ) {
    onUpdateLivestockFamily(filter: $filter, userId: $userId) {
      id
      parentID
      childID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userId
      __typename
    }
  }
`;
export const onDeleteLivestockFamily = /* GraphQL */ `
  subscription OnDeleteLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $userId: String
  ) {
    onDeleteLivestockFamily(filter: $filter, userId: $userId) {
      id
      parentID
      childID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      userId
      __typename
    }
  }
`;
export const onCreateMedicalRecord = /* GraphQL */ `
  subscription OnCreateMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $userId: String
  ) {
    onCreateMedicalRecord(filter: $filter, userId: $userId) {
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
        userId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      livestockMedicalRecordsId
      userId
      __typename
    }
  }
`;
export const onUpdateMedicalRecord = /* GraphQL */ `
  subscription OnUpdateMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $userId: String
  ) {
    onUpdateMedicalRecord(filter: $filter, userId: $userId) {
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
        userId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      livestockMedicalRecordsId
      userId
      __typename
    }
  }
`;
export const onDeleteMedicalRecord = /* GraphQL */ `
  subscription OnDeleteMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $userId: String
  ) {
    onDeleteMedicalRecord(filter: $filter, userId: $userId) {
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
        userId
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      livestockMedicalRecordsId
      userId
      __typename
    }
  }
`;
export const onCreateChickenFlock = /* GraphQL */ `
  subscription OnCreateChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $userId: String
  ) {
    onCreateChickenFlock(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onUpdateChickenFlock = /* GraphQL */ `
  subscription OnUpdateChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $userId: String
  ) {
    onUpdateChickenFlock(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onDeleteChickenFlock = /* GraphQL */ `
  subscription OnDeleteChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $userId: String
  ) {
    onDeleteChickenFlock(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onCreateEggLog = /* GraphQL */ `
  subscription OnCreateEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $userId: String
  ) {
    onCreateEggLog(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onUpdateEggLog = /* GraphQL */ `
  subscription OnUpdateEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $userId: String
  ) {
    onUpdateEggLog(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onDeleteEggLog = /* GraphQL */ `
  subscription OnDeleteEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $userId: String
  ) {
    onDeleteEggLog(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onCreateInventoryItem = /* GraphQL */ `
  subscription OnCreateInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $userId: String
  ) {
    onCreateInventoryItem(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onUpdateInventoryItem = /* GraphQL */ `
  subscription OnUpdateInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $userId: String
  ) {
    onUpdateInventoryItem(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
export const onDeleteInventoryItem = /* GraphQL */ `
  subscription OnDeleteInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $userId: String
  ) {
    onDeleteInventoryItem(filter: $filter, userId: $userId) {
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
      userId
      __typename
    }
  }
`;
