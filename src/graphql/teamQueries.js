/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
          user {
            id
            username
            email
            firstName
            lastName
            phone
            profilePictureKey
          }
        }
        nextToken
      }
      invitations {
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
        }
        nextToken
      }
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
      }
      nextToken
    }
  }
`;

export const getTeamMember = /* GraphQL */ `
  query GetTeamMember($id: ID!) {
    getTeamMember(id: $id) {
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
      farm {
        id
        name
        farmType
      }
      user {
        id
        username
        email
        firstName
        lastName
        phone
        profilePictureKey
      }
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
        user {
          id
          username
          email
          firstName
          lastName
          phone
          profilePictureKey
        }
      }
      nextToken
    }
  }
`;

export const teamMembersByFarm = /* GraphQL */ `
  query TeamMembersByFarm(
    $farmID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamMemberFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamMembersByFarm(
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
        user {
          id
          username
          email
          firstName
          lastName
          phone
          profilePictureKey
        }
      }
      nextToken
    }
  }
`;

export const getTeamInvitation = /* GraphQL */ `
  query GetTeamInvitation($id: ID!) {
    getTeamInvitation(id: $id) {
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
      farm {
        id
        name
        farmType
      }
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
      }
      nextToken
    }
  }
`;

export const teamInvitationsByFarm = /* GraphQL */ `
  query TeamInvitationsByFarm(
    $farmID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelTeamInvitationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    teamInvitationsByFarm(
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
      }
      nextToken
    }
  }
`;