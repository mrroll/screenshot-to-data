import { graphql } from '@/graphql/graphql';

export const AppPageScreenshotScreenshotsQuery = graphql(`
  query ScreenshotsQuery($options: ScreenshotsQueryInput) {
    Screenshots(options: $options) {
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
