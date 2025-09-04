/* eslint-disable */
// Invoice-specific GraphQL mutations (manually added until AWS deployment issue resolved)

export const createCustomer = /* GraphQL */ `
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
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
  }
`;

export const updateCustomer = /* GraphQL */ `
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
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
  }
`;

export const deleteCustomer = /* GraphQL */ `
  mutation DeleteCustomer($input: DeleteCustomerInput!) {
    deleteCustomer(input: $input) {
      id
      __typename
    }
  }
`;

export const createInvoice = /* GraphQL */ `
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
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
  }
`;

export const updateInvoice = /* GraphQL */ `
  mutation UpdateInvoice($input: UpdateInvoiceInput!) {
    updateInvoice(input: $input) {
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
  }
`;

export const deleteInvoice = /* GraphQL */ `
  mutation DeleteInvoice($input: DeleteInvoiceInput!) {
    deleteInvoice(input: $input) {
      id
      __typename
    }
  }
`;

export const createInvoiceItem = /* GraphQL */ `
  mutation CreateInvoiceItem($input: CreateInvoiceItemInput!) {
    createInvoiceItem(input: $input) {
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
  }
`;

export const updateInvoiceItem = /* GraphQL */ `
  mutation UpdateInvoiceItem($input: UpdateInvoiceItemInput!) {
    updateInvoiceItem(input: $input) {
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
  }
`;

export const deleteInvoiceItem = /* GraphQL */ `
  mutation DeleteInvoiceItem($input: DeleteInvoiceItemInput!) {
    deleteInvoiceItem(input: $input) {
      id
      __typename
    }
  }
`;

export const createProduct = /* GraphQL */ `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
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
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
      id
      __typename
    }
  }
`;