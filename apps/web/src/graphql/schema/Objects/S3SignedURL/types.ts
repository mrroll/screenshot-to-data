export const S3SignedURLTypes = /* GraphQL */ `
  input S3SignedURLsInput {
    name: String!
  }

  type S3SignedURLsOutput {
    name: String!
    URL: String!
    exists: Boolean!
  }

  type Mutation {
    S3SignedURLs(S3SignedURLs: [S3SignedURLsInput!]!): [S3SignedURLsOutput!]!
  }
`;
