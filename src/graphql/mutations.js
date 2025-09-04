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
      firstName
      lastName
      farmName
      phone
      aboutMe
      jobTitle
      location
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
      teamMemberships {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
      firstName
      lastName
      farmName
      phone
      aboutMe
      jobTitle
      location
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
      teamMemberships {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
      firstName
      lastName
      farmName
      phone
      aboutMe
      jobTitle
      location
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
      teamMemberships {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
      createdAt
      updatedAt
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
      createdAt
      updatedAt
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
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createLineItem = /* GraphQL */ `
  mutation CreateLineItem(
    $input: CreateLineItemInput!
    $condition: ModelLineItemConditionInput
  ) {
    createLineItem(input: $input, condition: $condition) {
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
export const updateLineItem = /* GraphQL */ `
  mutation UpdateLineItem(
    $input: UpdateLineItemInput!
    $condition: ModelLineItemConditionInput
  ) {
    updateLineItem(input: $input, condition: $condition) {
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
export const deleteLineItem = /* GraphQL */ `
  mutation DeleteLineItem(
    $input: DeleteLineItemInput!
    $condition: ModelLineItemConditionInput
  ) {
    deleteLineItem(input: $input, condition: $condition) {
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
export const createIncome = /* GraphQL */ `
  mutation CreateIncome(
    $input: CreateIncomeInput!
    $condition: ModelIncomeConditionInput
  ) {
    createIncome(input: $input, condition: $condition) {
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
        sub
        name
        species
        breed
        birthdate
        weight
        gender
        status
        notes
        fieldID
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
export const updateIncome = /* GraphQL */ `
  mutation UpdateIncome(
    $input: UpdateIncomeInput!
    $condition: ModelIncomeConditionInput
  ) {
    updateIncome(input: $input, condition: $condition) {
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
        sub
        name
        species
        breed
        birthdate
        weight
        gender
        status
        notes
        fieldID
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
export const deleteIncome = /* GraphQL */ `
  mutation DeleteIncome(
    $input: DeleteIncomeInput!
    $condition: ModelIncomeConditionInput
  ) {
    deleteIncome(input: $input, condition: $condition) {
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
        sub
        name
        species
        breed
        birthdate
        weight
        gender
        status
        notes
        fieldID
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
export const createField = /* GraphQL */ `
  mutation CreateField(
    $input: CreateFieldInput!
    $condition: ModelFieldConditionInput
  ) {
    createField(input: $input, condition: $condition) {
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
export const updateField = /* GraphQL */ `
  mutation UpdateField(
    $input: UpdateFieldInput!
    $condition: ModelFieldConditionInput
  ) {
    updateField(input: $input, condition: $condition) {
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
export const deleteField = /* GraphQL */ `
  mutation DeleteField(
    $input: DeleteFieldInput!
    $condition: ModelFieldConditionInput
  ) {
    deleteField(input: $input, condition: $condition) {
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
export const createLivestock = /* GraphQL */ `
  mutation CreateLivestock(
    $input: CreateLivestockInput!
    $condition: ModelLivestockConditionInput
  ) {
    createLivestock(input: $input, condition: $condition) {
      id
      sub
      name
      species
      breed
      birthdate
      weight
      gender
      status
      notes
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
      incomes {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
      sub
      name
      species
      breed
      birthdate
      weight
      gender
      status
      notes
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
      incomes {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
      sub
      name
      species
      breed
      birthdate
      weight
      gender
      status
      notes
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
      incomes {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
      sub
      parentID
      childID
      createdAt
      updatedAt
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
      sub
      parentID
      childID
      createdAt
      updatedAt
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
      sub
      parentID
      childID
      createdAt
      updatedAt
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
        notes
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
export const updateMedicalRecord = /* GraphQL */ `
  mutation UpdateMedicalRecord(
    $input: UpdateMedicalRecordInput!
    $condition: ModelMedicalRecordConditionInput
  ) {
    updateMedicalRecord(input: $input, condition: $condition) {
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
        notes
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
export const deleteMedicalRecord = /* GraphQL */ `
  mutation DeleteMedicalRecord(
    $input: DeleteMedicalRecordInput!
    $condition: ModelMedicalRecordConditionInput
  ) {
    deleteMedicalRecord(input: $input, condition: $condition) {
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
        notes
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
export const createChickenFlock = /* GraphQL */ `
  mutation CreateChickenFlock(
    $input: CreateChickenFlockInput!
    $condition: ModelChickenFlockConditionInput
  ) {
    createChickenFlock(input: $input, condition: $condition) {
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
export const updateChickenFlock = /* GraphQL */ `
  mutation UpdateChickenFlock(
    $input: UpdateChickenFlockInput!
    $condition: ModelChickenFlockConditionInput
  ) {
    updateChickenFlock(input: $input, condition: $condition) {
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
export const deleteChickenFlock = /* GraphQL */ `
  mutation DeleteChickenFlock(
    $input: DeleteChickenFlockInput!
    $condition: ModelChickenFlockConditionInput
  ) {
    deleteChickenFlock(input: $input, condition: $condition) {
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
export const createEggLog = /* GraphQL */ `
  mutation CreateEggLog(
    $input: CreateEggLogInput!
    $condition: ModelEggLogConditionInput
  ) {
    createEggLog(input: $input, condition: $condition) {
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
export const updateEggLog = /* GraphQL */ `
  mutation UpdateEggLog(
    $input: UpdateEggLogInput!
    $condition: ModelEggLogConditionInput
  ) {
    updateEggLog(input: $input, condition: $condition) {
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
export const deleteEggLog = /* GraphQL */ `
  mutation DeleteEggLog(
    $input: DeleteEggLogInput!
    $condition: ModelEggLogConditionInput
  ) {
    deleteEggLog(input: $input, condition: $condition) {
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
export const createInventoryItem = /* GraphQL */ `
  mutation CreateInventoryItem(
    $input: CreateInventoryItemInput!
    $condition: ModelInventoryItemConditionInput
  ) {
    createInventoryItem(input: $input, condition: $condition) {
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
export const updateInventoryItem = /* GraphQL */ `
  mutation UpdateInventoryItem(
    $input: UpdateInventoryItemInput!
    $condition: ModelInventoryItemConditionInput
  ) {
    updateInventoryItem(input: $input, condition: $condition) {
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
export const deleteInventoryItem = /* GraphQL */ `
  mutation DeleteInventoryItem(
    $input: DeleteInventoryItemInput!
    $condition: ModelInventoryItemConditionInput
  ) {
    deleteInventoryItem(input: $input, condition: $condition) {
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
export const createCustomer = /* GraphQL */ `
  mutation CreateCustomer(
    $input: CreateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    createCustomer(input: $input, condition: $condition) {
      id
      sub
      name
      email
      phone
      address
      city
      state
      zipCode
      country
      taxNumber
      notes
      createdAt
      updatedAt
      invoices {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateCustomer = /* GraphQL */ `
  mutation UpdateCustomer(
    $input: UpdateCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    updateCustomer(input: $input, condition: $condition) {
      id
      sub
      name
      email
      phone
      address
      city
      state
      zipCode
      country
      taxNumber
      notes
      createdAt
      updatedAt
      invoices {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteCustomer = /* GraphQL */ `
  mutation DeleteCustomer(
    $input: DeleteCustomerInput!
    $condition: ModelCustomerConditionInput
  ) {
    deleteCustomer(input: $input, condition: $condition) {
      id
      sub
      name
      email
      phone
      address
      city
      state
      zipCode
      country
      taxNumber
      notes
      createdAt
      updatedAt
      invoices {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createInvoice = /* GraphQL */ `
  mutation CreateInvoice(
    $input: CreateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    createInvoice(input: $input, condition: $condition) {
      id
      sub
      customerID
      customer {
        id
        sub
        name
        email
        phone
        address
        city
        state
        zipCode
        country
        taxNumber
        notes
        createdAt
        updatedAt
        __typename
      }
      invoiceNumber
      date
      dueDate
      status
      subtotal
      taxRate
      taxAmount
      discountAmount
      total
      notes
      terms
      paidDate
      createdAt
      updatedAt
      items {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateInvoice = /* GraphQL */ `
  mutation UpdateInvoice(
    $input: UpdateInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    updateInvoice(input: $input, condition: $condition) {
      id
      sub
      customerID
      customer {
        id
        sub
        name
        email
        phone
        address
        city
        state
        zipCode
        country
        taxNumber
        notes
        createdAt
        updatedAt
        __typename
      }
      invoiceNumber
      date
      dueDate
      status
      subtotal
      taxRate
      taxAmount
      discountAmount
      total
      notes
      terms
      paidDate
      createdAt
      updatedAt
      items {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteInvoice = /* GraphQL */ `
  mutation DeleteInvoice(
    $input: DeleteInvoiceInput!
    $condition: ModelInvoiceConditionInput
  ) {
    deleteInvoice(input: $input, condition: $condition) {
      id
      sub
      customerID
      customer {
        id
        sub
        name
        email
        phone
        address
        city
        state
        zipCode
        country
        taxNumber
        notes
        createdAt
        updatedAt
        __typename
      }
      invoiceNumber
      date
      dueDate
      status
      subtotal
      taxRate
      taxAmount
      discountAmount
      total
      notes
      terms
      paidDate
      createdAt
      updatedAt
      items {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createInvoiceItem = /* GraphQL */ `
  mutation CreateInvoiceItem(
    $input: CreateInvoiceItemInput!
    $condition: ModelInvoiceItemConditionInput
  ) {
    createInvoiceItem(input: $input, condition: $condition) {
      id
      sub
      invoiceID
      invoice {
        id
        sub
        customerID
        invoiceNumber
        date
        dueDate
        status
        subtotal
        taxRate
        taxAmount
        discountAmount
        total
        notes
        terms
        paidDate
        createdAt
        updatedAt
        __typename
      }
      description
      quantity
      unitPrice
      total
      category
      unit
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateInvoiceItem = /* GraphQL */ `
  mutation UpdateInvoiceItem(
    $input: UpdateInvoiceItemInput!
    $condition: ModelInvoiceItemConditionInput
  ) {
    updateInvoiceItem(input: $input, condition: $condition) {
      id
      sub
      invoiceID
      invoice {
        id
        sub
        customerID
        invoiceNumber
        date
        dueDate
        status
        subtotal
        taxRate
        taxAmount
        discountAmount
        total
        notes
        terms
        paidDate
        createdAt
        updatedAt
        __typename
      }
      description
      quantity
      unitPrice
      total
      category
      unit
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteInvoiceItem = /* GraphQL */ `
  mutation DeleteInvoiceItem(
    $input: DeleteInvoiceItemInput!
    $condition: ModelInvoiceItemConditionInput
  ) {
    deleteInvoiceItem(input: $input, condition: $condition) {
      id
      sub
      invoiceID
      invoice {
        id
        sub
        customerID
        invoiceNumber
        date
        dueDate
        status
        subtotal
        taxRate
        taxAmount
        discountAmount
        total
        notes
        terms
        paidDate
        createdAt
        updatedAt
        __typename
      }
      description
      quantity
      unitPrice
      total
      category
      unit
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
      id
      sub
      name
      description
      category
      unitPrice
      unit
      sku
      barcode
      stockQuantity
      minStockLevel
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
      id
      sub
      name
      description
      category
      unitPrice
      unit
      sku
      barcode
      stockQuantity
      minStockLevel
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
      id
      sub
      name
      description
      category
      unitPrice
      unit
      sku
      barcode
      stockQuantity
      minStockLevel
      isActive
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createFarm = /* GraphQL */ `
  mutation CreateFarm(
    $input: CreateFarmInput!
    $condition: ModelFarmConditionInput
  ) {
    createFarm(input: $input, condition: $condition) {
      id
      ownerSub
      name
      farmType
      description
      address
      city
      state
      zipCode
      country
      acres
      establishedYear
      website
      businessRegistration
      taxId
      phoneNumber
      email
      isActive
      createdAt
      updatedAt
      members {
        nextToken
        __typename
      }
      invitations {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const updateFarm = /* GraphQL */ `
  mutation UpdateFarm(
    $input: UpdateFarmInput!
    $condition: ModelFarmConditionInput
  ) {
    updateFarm(input: $input, condition: $condition) {
      id
      ownerSub
      name
      farmType
      description
      address
      city
      state
      zipCode
      country
      acres
      establishedYear
      website
      businessRegistration
      taxId
      phoneNumber
      email
      isActive
      createdAt
      updatedAt
      members {
        nextToken
        __typename
      }
      invitations {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const deleteFarm = /* GraphQL */ `
  mutation DeleteFarm(
    $input: DeleteFarmInput!
    $condition: ModelFarmConditionInput
  ) {
    deleteFarm(input: $input, condition: $condition) {
      id
      ownerSub
      name
      farmType
      description
      address
      city
      state
      zipCode
      country
      acres
      establishedYear
      website
      businessRegistration
      taxId
      phoneNumber
      email
      isActive
      createdAt
      updatedAt
      members {
        nextToken
        __typename
      }
      invitations {
        nextToken
        __typename
      }
      __typename
    }
  }
`;
export const createTeamMember = /* GraphQL */ `
  mutation CreateTeamMember(
    $input: CreateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    createTeamMember(input: $input, condition: $condition) {
      id
      farmID
      farm {
        id
        ownerSub
        name
        farmType
        description
        address
        city
        state
        zipCode
        country
        acres
        establishedYear
        website
        businessRegistration
        taxId
        phoneNumber
        email
        isActive
        createdAt
        updatedAt
        __typename
      }
      userID
      user {
        id
        sub
        username
        email
        firstName
        lastName
        farmName
        phone
        aboutMe
        jobTitle
        location
        profilePictureKey
        role
        preferences
        createdAt
        updatedAt
        __typename
      }
      userSub
      role
      permissions
      isActive
      joinedAt
      lastLoginAt
      invitedBy
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTeamMember = /* GraphQL */ `
  mutation UpdateTeamMember(
    $input: UpdateTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    updateTeamMember(input: $input, condition: $condition) {
      id
      farmID
      farm {
        id
        ownerSub
        name
        farmType
        description
        address
        city
        state
        zipCode
        country
        acres
        establishedYear
        website
        businessRegistration
        taxId
        phoneNumber
        email
        isActive
        createdAt
        updatedAt
        __typename
      }
      userID
      user {
        id
        sub
        username
        email
        firstName
        lastName
        farmName
        phone
        aboutMe
        jobTitle
        location
        profilePictureKey
        role
        preferences
        createdAt
        updatedAt
        __typename
      }
      userSub
      role
      permissions
      isActive
      joinedAt
      lastLoginAt
      invitedBy
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTeamMember = /* GraphQL */ `
  mutation DeleteTeamMember(
    $input: DeleteTeamMemberInput!
    $condition: ModelTeamMemberConditionInput
  ) {
    deleteTeamMember(input: $input, condition: $condition) {
      id
      farmID
      farm {
        id
        ownerSub
        name
        farmType
        description
        address
        city
        state
        zipCode
        country
        acres
        establishedYear
        website
        businessRegistration
        taxId
        phoneNumber
        email
        isActive
        createdAt
        updatedAt
        __typename
      }
      userID
      user {
        id
        sub
        username
        email
        firstName
        lastName
        farmName
        phone
        aboutMe
        jobTitle
        location
        profilePictureKey
        role
        preferences
        createdAt
        updatedAt
        __typename
      }
      userSub
      role
      permissions
      isActive
      joinedAt
      lastLoginAt
      invitedBy
      notes
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createTeamInvitation = /* GraphQL */ `
  mutation CreateTeamInvitation(
    $input: CreateTeamInvitationInput!
    $condition: ModelTeamInvitationConditionInput
  ) {
    createTeamInvitation(input: $input, condition: $condition) {
      id
      farmID
      farm {
        id
        ownerSub
        name
        farmType
        description
        address
        city
        state
        zipCode
        country
        acres
        establishedYear
        website
        businessRegistration
        taxId
        phoneNumber
        email
        isActive
        createdAt
        updatedAt
        __typename
      }
      email
      role
      status
      invitedByUserSub
      invitedByName
      message
      expiresAt
      acceptedAt
      rejectedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTeamInvitation = /* GraphQL */ `
  mutation UpdateTeamInvitation(
    $input: UpdateTeamInvitationInput!
    $condition: ModelTeamInvitationConditionInput
  ) {
    updateTeamInvitation(input: $input, condition: $condition) {
      id
      farmID
      farm {
        id
        ownerSub
        name
        farmType
        description
        address
        city
        state
        zipCode
        country
        acres
        establishedYear
        website
        businessRegistration
        taxId
        phoneNumber
        email
        isActive
        createdAt
        updatedAt
        __typename
      }
      email
      role
      status
      invitedByUserSub
      invitedByName
      message
      expiresAt
      acceptedAt
      rejectedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTeamInvitation = /* GraphQL */ `
  mutation DeleteTeamInvitation(
    $input: DeleteTeamInvitationInput!
    $condition: ModelTeamInvitationConditionInput
  ) {
    deleteTeamInvitation(input: $input, condition: $condition) {
      id
      farmID
      farm {
        id
        ownerSub
        name
        farmType
        description
        address
        city
        state
        zipCode
        country
        acres
        establishedYear
        website
        businessRegistration
        taxId
        phoneNumber
        email
        isActive
        createdAt
        updatedAt
        __typename
      }
      email
      role
      status
      invitedByUserSub
      invitedByName
      message
      expiresAt
      acceptedAt
      rejectedAt
      createdAt
      updatedAt
      __typename
    }
  }
`;
