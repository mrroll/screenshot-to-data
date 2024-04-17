import { graphql } from '@/graphql/graphql';

export const AppPageScreenshotScreenshotsQuery = graphql(`
  query ScreenshotsQuery(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $limit: Int
    $orderBy: String
    $orderByDirection: String
  ) {
    Screenshots(
      first: $first
      after: $after
      last: $last
      before: $before
      limit: $limit
      orderBy: $orderBy
      orderByDirection: $orderByDirection
    ) {
      CUID2
      Description
      OriginalFilename
      UpdatedAt
      user {
        email
      }
    }
  }
`);
