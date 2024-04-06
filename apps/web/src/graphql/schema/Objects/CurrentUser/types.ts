export const CurrentUserTypes = /* GraphQL */ `
  type Query {
    CurrentUser: User!
  }

  input UserPreferenceInput {
    Prompt: String
  }

  input CurrentUserMutationInput {
    user_preference: UserPreferenceInput
  }

  type CurrentUserMutationOutput {
    user_preference: UserPreference
  }

  type Mutation {
    CurrentUser(options: CurrentUserMutationInput!): CurrentUserMutationOutput!
  }
`;
