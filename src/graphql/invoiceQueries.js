/* eslint-disable */
// Invoice-specific GraphQL queries (manually added until AWS deployment issue resolved)

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
        items {
          id
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
        name
        email
        phone
        address
        city
        state
        zipCode
        country
        taxNumber
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
        customer {
          id
          name
          email
          phone
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