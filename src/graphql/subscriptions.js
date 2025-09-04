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
export const onCreateCustomer = /* GraphQL */ `
  subscription OnCreateCustomer(
    $filter: ModelSubscriptionCustomerFilterInput
    $sub: String
  ) {
    onCreateCustomer(filter: $filter, sub: $sub) {
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
export const onUpdateCustomer = /* GraphQL */ `
  subscription OnUpdateCustomer(
    $filter: ModelSubscriptionCustomerFilterInput
    $sub: String
  ) {
    onUpdateCustomer(filter: $filter, sub: $sub) {
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
export const onDeleteCustomer = /* GraphQL */ `
  subscription OnDeleteCustomer(
    $filter: ModelSubscriptionCustomerFilterInput
    $sub: String
  ) {
    onDeleteCustomer(filter: $filter, sub: $sub) {
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
export const onCreateInvoice = /* GraphQL */ `
  subscription OnCreateInvoice(
    $filter: ModelSubscriptionInvoiceFilterInput
    $sub: String
  ) {
    onCreateInvoice(filter: $filter, sub: $sub) {
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
export const onUpdateInvoice = /* GraphQL */ `
  subscription OnUpdateInvoice(
    $filter: ModelSubscriptionInvoiceFilterInput
    $sub: String
  ) {
    onUpdateInvoice(filter: $filter, sub: $sub) {
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
export const onDeleteInvoice = /* GraphQL */ `
  subscription OnDeleteInvoice(
    $filter: ModelSubscriptionInvoiceFilterInput
    $sub: String
  ) {
    onDeleteInvoice(filter: $filter, sub: $sub) {
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
export const onCreateInvoiceItem = /* GraphQL */ `
  subscription OnCreateInvoiceItem(
    $filter: ModelSubscriptionInvoiceItemFilterInput
    $sub: String
  ) {
    onCreateInvoiceItem(filter: $filter, sub: $sub) {
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
export const onUpdateInvoiceItem = /* GraphQL */ `
  subscription OnUpdateInvoiceItem(
    $filter: ModelSubscriptionInvoiceItemFilterInput
    $sub: String
  ) {
    onUpdateInvoiceItem(filter: $filter, sub: $sub) {
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
export const onDeleteInvoiceItem = /* GraphQL */ `
  subscription OnDeleteInvoiceItem(
    $filter: ModelSubscriptionInvoiceItemFilterInput
    $sub: String
  ) {
    onDeleteInvoiceItem(filter: $filter, sub: $sub) {
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
export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct(
    $filter: ModelSubscriptionProductFilterInput
    $sub: String
  ) {
    onCreateProduct(filter: $filter, sub: $sub) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct(
    $filter: ModelSubscriptionProductFilterInput
    $sub: String
  ) {
    onUpdateProduct(filter: $filter, sub: $sub) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct(
    $filter: ModelSubscriptionProductFilterInput
    $sub: String
  ) {
    onDeleteProduct(filter: $filter, sub: $sub) {
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
export const onCreateFarm = /* GraphQL */ `
  subscription OnCreateFarm(
    $filter: ModelSubscriptionFarmFilterInput
    $ownerSub: String
  ) {
    onCreateFarm(filter: $filter, ownerSub: $ownerSub) {
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
export const onUpdateFarm = /* GraphQL */ `
  subscription OnUpdateFarm(
    $filter: ModelSubscriptionFarmFilterInput
    $ownerSub: String
  ) {
    onUpdateFarm(filter: $filter, ownerSub: $ownerSub) {
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
export const onDeleteFarm = /* GraphQL */ `
  subscription OnDeleteFarm(
    $filter: ModelSubscriptionFarmFilterInput
    $ownerSub: String
  ) {
    onDeleteFarm(filter: $filter, ownerSub: $ownerSub) {
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
export const onCreateTeamMember = /* GraphQL */ `
  subscription OnCreateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
    $userSub: String
  ) {
    onCreateTeamMember(filter: $filter, userSub: $userSub) {
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
export const onUpdateTeamMember = /* GraphQL */ `
  subscription OnUpdateTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
    $userSub: String
  ) {
    onUpdateTeamMember(filter: $filter, userSub: $userSub) {
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
export const onDeleteTeamMember = /* GraphQL */ `
  subscription OnDeleteTeamMember(
    $filter: ModelSubscriptionTeamMemberFilterInput
    $userSub: String
  ) {
    onDeleteTeamMember(filter: $filter, userSub: $userSub) {
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
export const onCreateTeamInvitation = /* GraphQL */ `
  subscription OnCreateTeamInvitation(
    $filter: ModelSubscriptionTeamInvitationFilterInput
  ) {
    onCreateTeamInvitation(filter: $filter) {
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
export const onUpdateTeamInvitation = /* GraphQL */ `
  subscription OnUpdateTeamInvitation(
    $filter: ModelSubscriptionTeamInvitationFilterInput
  ) {
    onUpdateTeamInvitation(filter: $filter) {
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
export const onDeleteTeamInvitation = /* GraphQL */ `
  subscription OnDeleteTeamInvitation(
    $filter: ModelSubscriptionTeamInvitationFilterInput
  ) {
    onDeleteTeamInvitation(filter: $filter) {
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
