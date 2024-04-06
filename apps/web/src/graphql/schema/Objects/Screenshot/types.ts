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

  input ScreenshotsQueryInput {
    first: Int
    after: String
    last: Int
    before: String
    orderBy: String
    orderByDirection: String
  }

  type Query {
    Screenshot(CUID2: String!): Screenshot!

    Screenshots(options: ScreenshotsQueryInput): [Screenshot!]!
  }
`;
