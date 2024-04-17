export const ScreenshotTypes = /* GraphQL */ `
  type Screenshot {
    CUID2: String!
    S3Filename: String
    OriginalFilename: String
    Description: String
    S3URL: String
    Width: Int
    Height: Int

    CreatedAt: DateTimeISO
    UpdatedAt: DateTimeISO

    user: User
  }

  type Query {
    Screenshot(CUID2: String!): Screenshot!
    Screenshots(
      first: Int
      after: String
      last: Int
      before: String
      limit: Int
      orderBy: String
      orderByDirection: String
    ): [Screenshot!]!
  }
`;
