export const GenerateS3SignedURLsTypes = /* GraphQL */ `
  input GenerateS3SignedURLMutationInput {
    name: String!
  }

  type GenerateS3SignedURLMutationOutput {
    name: String!
    URL: String!
    exists: Boolean!
  }

  type Mutation {
    GenerateS3SignedURLs(
      options: [GenerateS3SignedURLMutationInput!]!
    ): [GenerateS3SignedURLMutationOutput!]!
  }
`;
