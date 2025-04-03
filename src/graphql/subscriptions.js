/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onCreateUser(filter: $filter, owner: $owner) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onUpdateUser(filter: $filter, owner: $owner) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $owner: String
  ) {
    onDeleteUser(filter: $filter, owner: $owner) {
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
export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $owner: String
  ) {
    onCreateExpense(filter: $filter, owner: $owner) {
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
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $owner: String
  ) {
    onUpdateExpense(filter: $filter, owner: $owner) {
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
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $owner: String
  ) {
    onDeleteExpense(filter: $filter, owner: $owner) {
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
export const onCreateIncome = /* GraphQL */ `
  subscription OnCreateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $owner: String
  ) {
    onCreateIncome(filter: $filter, owner: $owner) {
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
export const onUpdateIncome = /* GraphQL */ `
  subscription OnUpdateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $owner: String
  ) {
    onUpdateIncome(filter: $filter, owner: $owner) {
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
export const onDeleteIncome = /* GraphQL */ `
  subscription OnDeleteIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $owner: String
  ) {
    onDeleteIncome(filter: $filter, owner: $owner) {
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
export const onCreateField = /* GraphQL */ `
  subscription OnCreateField(
    $filter: ModelSubscriptionFieldFilterInput
    $owner: String
  ) {
    onCreateField(filter: $filter, owner: $owner) {
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
export const onUpdateField = /* GraphQL */ `
  subscription OnUpdateField(
    $filter: ModelSubscriptionFieldFilterInput
    $owner: String
  ) {
    onUpdateField(filter: $filter, owner: $owner) {
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
export const onDeleteField = /* GraphQL */ `
  subscription OnDeleteField(
    $filter: ModelSubscriptionFieldFilterInput
    $owner: String
  ) {
    onDeleteField(filter: $filter, owner: $owner) {
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
export const onCreateLivestock = /* GraphQL */ `
  subscription OnCreateLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $owner: String
  ) {
    onCreateLivestock(filter: $filter, owner: $owner) {
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
export const onUpdateLivestock = /* GraphQL */ `
  subscription OnUpdateLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $owner: String
  ) {
    onUpdateLivestock(filter: $filter, owner: $owner) {
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
export const onDeleteLivestock = /* GraphQL */ `
  subscription OnDeleteLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $owner: String
  ) {
    onDeleteLivestock(filter: $filter, owner: $owner) {
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
export const onCreateLivestockFamily = /* GraphQL */ `
  subscription OnCreateLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $owner: String
  ) {
    onCreateLivestockFamily(filter: $filter, owner: $owner) {
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
export const onUpdateLivestockFamily = /* GraphQL */ `
  subscription OnUpdateLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $owner: String
  ) {
    onUpdateLivestockFamily(filter: $filter, owner: $owner) {
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
export const onDeleteLivestockFamily = /* GraphQL */ `
  subscription OnDeleteLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $owner: String
  ) {
    onDeleteLivestockFamily(filter: $filter, owner: $owner) {
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
export const onCreateMedicalRecord = /* GraphQL */ `
  subscription OnCreateMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $owner: String
  ) {
    onCreateMedicalRecord(filter: $filter, owner: $owner) {
      id
      livestockID
      date
      description
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
  }
`;
export const onUpdateMedicalRecord = /* GraphQL */ `
  subscription OnUpdateMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $owner: String
  ) {
    onUpdateMedicalRecord(filter: $filter, owner: $owner) {
      id
      livestockID
      date
      description
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
  }
`;
export const onDeleteMedicalRecord = /* GraphQL */ `
  subscription OnDeleteMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $owner: String
  ) {
    onDeleteMedicalRecord(filter: $filter, owner: $owner) {
      id
      livestockID
      date
      description
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
  }
`;
export const onCreateChickenFlock = /* GraphQL */ `
  subscription OnCreateChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $owner: String
  ) {
    onCreateChickenFlock(filter: $filter, owner: $owner) {
      id
      breed
      count
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
export const onUpdateChickenFlock = /* GraphQL */ `
  subscription OnUpdateChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $owner: String
  ) {
    onUpdateChickenFlock(filter: $filter, owner: $owner) {
      id
      breed
      count
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
export const onDeleteChickenFlock = /* GraphQL */ `
  subscription OnDeleteChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $owner: String
  ) {
    onDeleteChickenFlock(filter: $filter, owner: $owner) {
      id
      breed
      count
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
export const onCreateEggLog = /* GraphQL */ `
  subscription OnCreateEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $owner: String
  ) {
    onCreateEggLog(filter: $filter, owner: $owner) {
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
export const onUpdateEggLog = /* GraphQL */ `
  subscription OnUpdateEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $owner: String
  ) {
    onUpdateEggLog(filter: $filter, owner: $owner) {
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
export const onDeleteEggLog = /* GraphQL */ `
  subscription OnDeleteEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $owner: String
  ) {
    onDeleteEggLog(filter: $filter, owner: $owner) {
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
export const onCreateInventoryItem = /* GraphQL */ `
  subscription OnCreateInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $owner: String
  ) {
    onCreateInventoryItem(filter: $filter, owner: $owner) {
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
export const onUpdateInventoryItem = /* GraphQL */ `
  subscription OnUpdateInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $owner: String
  ) {
    onUpdateInventoryItem(filter: $filter, owner: $owner) {
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
export const onDeleteInventoryItem = /* GraphQL */ `
  subscription OnDeleteInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $owner: String
  ) {
    onDeleteInventoryItem(filter: $filter, owner: $owner) {
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
