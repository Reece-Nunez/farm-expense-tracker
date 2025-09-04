/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
        livestockID
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
        notes
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
export const getCustomer = /* GraphQL */ `
  query GetCustomer($id: ID!) {
    getCustomer(id: $id) {
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
export const listCustomers = /* GraphQL */ `
  query ListCustomers(
    $filter: ModelCustomerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCustomers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getInvoice = /* GraphQL */ `
  query GetInvoice($id: ID!) {
    getInvoice(id: $id) {
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
export const listInvoices = /* GraphQL */ `
  query ListInvoices(
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvoices(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getInvoiceItem = /* GraphQL */ `
  query GetInvoiceItem($id: ID!) {
    getInvoiceItem(id: $id) {
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
export const listInvoiceItems = /* GraphQL */ `
  query ListInvoiceItems(
    $filter: ModelInvoiceItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInvoiceItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        sub
        invoiceID
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
      nextToken
      __typename
    }
  }
`;
export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
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
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getFarm = /* GraphQL */ `
  query GetFarm($id: ID!) {
    getFarm(id: $id) {
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
export const listFarms = /* GraphQL */ `
  query ListFarms(
    $filter: ModelFarmFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFarms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const getTeamMember = /* GraphQL */ `
  query GetTeamMember($id: ID!) {
    getTeamMember(id: $id) {
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
export const listTeamMembers = /* GraphQL */ `
  query ListTeamMembers(
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamMembers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        farmID
        userID
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
      nextToken
      __typename
    }
  }
`;
export const getTeamInvitation = /* GraphQL */ `
  query GetTeamInvitation($id: ID!) {
    getTeamInvitation(id: $id) {
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
export const listTeamInvitations = /* GraphQL */ `
  query ListTeamInvitations(
    $filter: ModelTeamInvitationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeamInvitations(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        farmID
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
export const incomesBySub = /* GraphQL */ `
  query IncomesBySub(
    $sub: String!
    $sortDirection: ModelSortDirection
    $filter: ModelIncomeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    incomesBySub(
      sub: $sub
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
        livestockID
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
        livestockID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const incomesByLivestock = /* GraphQL */ `
  query IncomesByLivestock(
    $livestockID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelIncomeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    incomesByLivestock(
      livestockID: $livestockID
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
        livestockID
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
        notes
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
export const invoicesByCustomerID = /* GraphQL */ `
  query InvoicesByCustomerID(
    $customerID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelInvoiceFilterInput
    $limit: Int
    $nextToken: String
  ) {
    invoicesByCustomerID(
      customerID: $customerID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const invoiceItemsByInvoiceID = /* GraphQL */ `
  query InvoiceItemsByInvoiceID(
    $invoiceID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelInvoiceItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    invoiceItemsByInvoiceID(
      invoiceID: $invoiceID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        sub
        invoiceID
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
      nextToken
      __typename
    }
  }
`;
export const teamMembersByFarmID = /* GraphQL */ `
  query TeamMembersByFarmID(
    $farmID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMembersByFarmID(
      farmID: $farmID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        farmID
        userID
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
      nextToken
      __typename
    }
  }
`;
export const teamMembersByUserID = /* GraphQL */ `
  query TeamMembersByUserID(
    $userID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMembersByUserID(
      userID: $userID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        farmID
        userID
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
      nextToken
      __typename
    }
  }
`;
export const teamInvitationsByFarmID = /* GraphQL */ `
  query TeamInvitationsByFarmID(
    $farmID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamInvitationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamInvitationsByFarmID(
      farmID: $farmID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        farmID
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
      nextToken
      __typename
    }
  }
`;
