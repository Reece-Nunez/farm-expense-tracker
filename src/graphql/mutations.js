/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createExpense = /* GraphQL */ `
  mutation CreateExpense(
    $input: CreateExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    createExpense(input: $input, condition: $condition) {
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
export const updateExpense = /* GraphQL */ `
  mutation UpdateExpense(
    $input: UpdateExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    updateExpense(input: $input, condition: $condition) {
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
export const deleteExpense = /* GraphQL */ `
  mutation DeleteExpense(
    $input: DeleteExpenseInput!
    $condition: ModelExpenseConditionInput
  ) {
    deleteExpense(input: $input, condition: $condition) {
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
export const createIncome = /* GraphQL */ `
  mutation CreateIncome(
    $input: CreateIncomeInput!
    $condition: ModelIncomeConditionInput
  ) {
    createIncome(input: $input, condition: $condition) {
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
export const updateIncome = /* GraphQL */ `
  mutation UpdateIncome(
    $input: UpdateIncomeInput!
    $condition: ModelIncomeConditionInput
  ) {
    updateIncome(input: $input, condition: $condition) {
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
export const deleteIncome = /* GraphQL */ `
  mutation DeleteIncome(
    $input: DeleteIncomeInput!
    $condition: ModelIncomeConditionInput
  ) {
    deleteIncome(input: $input, condition: $condition) {
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
export const createField = /* GraphQL */ `
  mutation CreateField(
    $input: CreateFieldInput!
    $condition: ModelFieldConditionInput
  ) {
    createField(input: $input, condition: $condition) {
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
export const updateField = /* GraphQL */ `
  mutation UpdateField(
    $input: UpdateFieldInput!
    $condition: ModelFieldConditionInput
  ) {
    updateField(input: $input, condition: $condition) {
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
export const deleteField = /* GraphQL */ `
  mutation DeleteField(
    $input: DeleteFieldInput!
    $condition: ModelFieldConditionInput
  ) {
    deleteField(input: $input, condition: $condition) {
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
export const createLivestock = /* GraphQL */ `
  mutation CreateLivestock(
    $input: CreateLivestockInput!
    $condition: ModelLivestockConditionInput
  ) {
    createLivestock(input: $input, condition: $condition) {
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
export const updateLivestock = /* GraphQL */ `
  mutation UpdateLivestock(
    $input: UpdateLivestockInput!
    $condition: ModelLivestockConditionInput
  ) {
    updateLivestock(input: $input, condition: $condition) {
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
export const deleteLivestock = /* GraphQL */ `
  mutation DeleteLivestock(
    $input: DeleteLivestockInput!
    $condition: ModelLivestockConditionInput
  ) {
    deleteLivestock(input: $input, condition: $condition) {
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
export const createLivestockFamily = /* GraphQL */ `
  mutation CreateLivestockFamily(
    $input: CreateLivestockFamilyInput!
    $condition: ModelLivestockFamilyConditionInput
  ) {
    createLivestockFamily(input: $input, condition: $condition) {
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
export const updateLivestockFamily = /* GraphQL */ `
  mutation UpdateLivestockFamily(
    $input: UpdateLivestockFamilyInput!
    $condition: ModelLivestockFamilyConditionInput
  ) {
    updateLivestockFamily(input: $input, condition: $condition) {
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
export const deleteLivestockFamily = /* GraphQL */ `
  mutation DeleteLivestockFamily(
    $input: DeleteLivestockFamilyInput!
    $condition: ModelLivestockFamilyConditionInput
  ) {
    deleteLivestockFamily(input: $input, condition: $condition) {
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
export const createMedicalRecord = /* GraphQL */ `
  mutation CreateMedicalRecord(
    $input: CreateMedicalRecordInput!
    $condition: ModelMedicalRecordConditionInput
  ) {
    createMedicalRecord(input: $input, condition: $condition) {
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
export const updateMedicalRecord = /* GraphQL */ `
  mutation UpdateMedicalRecord(
    $input: UpdateMedicalRecordInput!
    $condition: ModelMedicalRecordConditionInput
  ) {
    updateMedicalRecord(input: $input, condition: $condition) {
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
export const deleteMedicalRecord = /* GraphQL */ `
  mutation DeleteMedicalRecord(
    $input: DeleteMedicalRecordInput!
    $condition: ModelMedicalRecordConditionInput
  ) {
    deleteMedicalRecord(input: $input, condition: $condition) {
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
export const createChickenFlock = /* GraphQL */ `
  mutation CreateChickenFlock(
    $input: CreateChickenFlockInput!
    $condition: ModelChickenFlockConditionInput
  ) {
    createChickenFlock(input: $input, condition: $condition) {
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
export const updateChickenFlock = /* GraphQL */ `
  mutation UpdateChickenFlock(
    $input: UpdateChickenFlockInput!
    $condition: ModelChickenFlockConditionInput
  ) {
    updateChickenFlock(input: $input, condition: $condition) {
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
export const deleteChickenFlock = /* GraphQL */ `
  mutation DeleteChickenFlock(
    $input: DeleteChickenFlockInput!
    $condition: ModelChickenFlockConditionInput
  ) {
    deleteChickenFlock(input: $input, condition: $condition) {
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
export const createEggLog = /* GraphQL */ `
  mutation CreateEggLog(
    $input: CreateEggLogInput!
    $condition: ModelEggLogConditionInput
  ) {
    createEggLog(input: $input, condition: $condition) {
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
export const updateEggLog = /* GraphQL */ `
  mutation UpdateEggLog(
    $input: UpdateEggLogInput!
    $condition: ModelEggLogConditionInput
  ) {
    updateEggLog(input: $input, condition: $condition) {
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
export const deleteEggLog = /* GraphQL */ `
  mutation DeleteEggLog(
    $input: DeleteEggLogInput!
    $condition: ModelEggLogConditionInput
  ) {
    deleteEggLog(input: $input, condition: $condition) {
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
export const createInventoryItem = /* GraphQL */ `
  mutation CreateInventoryItem(
    $input: CreateInventoryItemInput!
    $condition: ModelInventoryItemConditionInput
  ) {
    createInventoryItem(input: $input, condition: $condition) {
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
export const updateInventoryItem = /* GraphQL */ `
  mutation UpdateInventoryItem(
    $input: UpdateInventoryItemInput!
    $condition: ModelInventoryItemConditionInput
  ) {
    updateInventoryItem(input: $input, condition: $condition) {
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
export const deleteInventoryItem = /* GraphQL */ `
  mutation DeleteInventoryItem(
    $input: DeleteInventoryItemInput!
    $condition: ModelInventoryItemConditionInput
  ) {
    deleteInventoryItem(input: $input, condition: $condition) {
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
