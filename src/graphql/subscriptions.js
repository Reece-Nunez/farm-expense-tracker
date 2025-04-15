/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser(
    $filter: ModelSubscriptionUserFilterInput
    $sub: String
  ) {
    onCreateUser(filter: $filter, sub: $sub) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser(
    $filter: ModelSubscriptionUserFilterInput
    $sub: String
  ) {
    onUpdateUser(filter: $filter, sub: $sub) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser(
    $filter: ModelSubscriptionUserFilterInput
    $sub: String
  ) {
    onDeleteUser(filter: $filter, sub: $sub) {
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
export const onCreateExpense = /* GraphQL */ `
  subscription OnCreateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $sub: String
  ) {
    onCreateExpense(filter: $filter, sub: $sub) {
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
export const onUpdateExpense = /* GraphQL */ `
  subscription OnUpdateExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $sub: String
  ) {
    onUpdateExpense(filter: $filter, sub: $sub) {
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
export const onDeleteExpense = /* GraphQL */ `
  subscription OnDeleteExpense(
    $filter: ModelSubscriptionExpenseFilterInput
    $sub: String
  ) {
    onDeleteExpense(filter: $filter, sub: $sub) {
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
export const onCreateLineItem = /* GraphQL */ `
  subscription OnCreateLineItem(
    $filter: ModelSubscriptionLineItemFilterInput
    $sub: String
  ) {
    onCreateLineItem(filter: $filter, sub: $sub) {
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
export const onUpdateLineItem = /* GraphQL */ `
  subscription OnUpdateLineItem(
    $filter: ModelSubscriptionLineItemFilterInput
    $sub: String
  ) {
    onUpdateLineItem(filter: $filter, sub: $sub) {
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
export const onDeleteLineItem = /* GraphQL */ `
  subscription OnDeleteLineItem(
    $filter: ModelSubscriptionLineItemFilterInput
    $sub: String
  ) {
    onDeleteLineItem(filter: $filter, sub: $sub) {
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
export const onCreateIncome = /* GraphQL */ `
  subscription OnCreateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $sub: String
  ) {
    onCreateIncome(filter: $filter, sub: $sub) {
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
export const onUpdateIncome = /* GraphQL */ `
  subscription OnUpdateIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $sub: String
  ) {
    onUpdateIncome(filter: $filter, sub: $sub) {
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
export const onDeleteIncome = /* GraphQL */ `
  subscription OnDeleteIncome(
    $filter: ModelSubscriptionIncomeFilterInput
    $sub: String
  ) {
    onDeleteIncome(filter: $filter, sub: $sub) {
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
export const onCreateField = /* GraphQL */ `
  subscription OnCreateField(
    $filter: ModelSubscriptionFieldFilterInput
    $sub: String
  ) {
    onCreateField(filter: $filter, sub: $sub) {
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
export const onUpdateField = /* GraphQL */ `
  subscription OnUpdateField(
    $filter: ModelSubscriptionFieldFilterInput
    $sub: String
  ) {
    onUpdateField(filter: $filter, sub: $sub) {
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
export const onDeleteField = /* GraphQL */ `
  subscription OnDeleteField(
    $filter: ModelSubscriptionFieldFilterInput
    $sub: String
  ) {
    onDeleteField(filter: $filter, sub: $sub) {
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
export const onCreateLivestock = /* GraphQL */ `
  subscription OnCreateLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $sub: String
  ) {
    onCreateLivestock(filter: $filter, sub: $sub) {
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
export const onUpdateLivestock = /* GraphQL */ `
  subscription OnUpdateLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $sub: String
  ) {
    onUpdateLivestock(filter: $filter, sub: $sub) {
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
export const onDeleteLivestock = /* GraphQL */ `
  subscription OnDeleteLivestock(
    $filter: ModelSubscriptionLivestockFilterInput
    $sub: String
  ) {
    onDeleteLivestock(filter: $filter, sub: $sub) {
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
export const onCreateLivestockFamily = /* GraphQL */ `
  subscription OnCreateLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $sub: String
  ) {
    onCreateLivestockFamily(filter: $filter, sub: $sub) {
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
export const onUpdateLivestockFamily = /* GraphQL */ `
  subscription OnUpdateLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $sub: String
  ) {
    onUpdateLivestockFamily(filter: $filter, sub: $sub) {
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
export const onDeleteLivestockFamily = /* GraphQL */ `
  subscription OnDeleteLivestockFamily(
    $filter: ModelSubscriptionLivestockFamilyFilterInput
    $sub: String
  ) {
    onDeleteLivestockFamily(filter: $filter, sub: $sub) {
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
export const onCreateMedicalRecord = /* GraphQL */ `
  subscription OnCreateMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $sub: String
  ) {
    onCreateMedicalRecord(filter: $filter, sub: $sub) {
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
export const onUpdateMedicalRecord = /* GraphQL */ `
  subscription OnUpdateMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $sub: String
  ) {
    onUpdateMedicalRecord(filter: $filter, sub: $sub) {
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
export const onDeleteMedicalRecord = /* GraphQL */ `
  subscription OnDeleteMedicalRecord(
    $filter: ModelSubscriptionMedicalRecordFilterInput
    $sub: String
  ) {
    onDeleteMedicalRecord(filter: $filter, sub: $sub) {
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
export const onCreateChickenFlock = /* GraphQL */ `
  subscription OnCreateChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $sub: String
  ) {
    onCreateChickenFlock(filter: $filter, sub: $sub) {
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
export const onUpdateChickenFlock = /* GraphQL */ `
  subscription OnUpdateChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $sub: String
  ) {
    onUpdateChickenFlock(filter: $filter, sub: $sub) {
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
export const onDeleteChickenFlock = /* GraphQL */ `
  subscription OnDeleteChickenFlock(
    $filter: ModelSubscriptionChickenFlockFilterInput
    $sub: String
  ) {
    onDeleteChickenFlock(filter: $filter, sub: $sub) {
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
export const onCreateEggLog = /* GraphQL */ `
  subscription OnCreateEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $sub: String
  ) {
    onCreateEggLog(filter: $filter, sub: $sub) {
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
export const onUpdateEggLog = /* GraphQL */ `
  subscription OnUpdateEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $sub: String
  ) {
    onUpdateEggLog(filter: $filter, sub: $sub) {
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
export const onDeleteEggLog = /* GraphQL */ `
  subscription OnDeleteEggLog(
    $filter: ModelSubscriptionEggLogFilterInput
    $sub: String
  ) {
    onDeleteEggLog(filter: $filter, sub: $sub) {
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
export const onCreateInventoryItem = /* GraphQL */ `
  subscription OnCreateInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $sub: String
  ) {
    onCreateInventoryItem(filter: $filter, sub: $sub) {
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
export const onUpdateInventoryItem = /* GraphQL */ `
  subscription OnUpdateInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $sub: String
  ) {
    onUpdateInventoryItem(filter: $filter, sub: $sub) {
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
export const onDeleteInventoryItem = /* GraphQL */ `
  subscription OnDeleteInventoryItem(
    $filter: ModelSubscriptionInventoryItemFilterInput
    $sub: String
  ) {
    onDeleteInventoryItem(filter: $filter, sub: $sub) {
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
