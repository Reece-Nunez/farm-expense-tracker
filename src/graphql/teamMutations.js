/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
  }
`;