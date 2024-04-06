import { graphql } from '@/graphql/graphql';

export const AppPageScreenshotScreenshotQuery = graphql(`
  query ScreenshotQuery($CUID2: String!) {
    Screenshot(CUID2: $CUID2) {
      S3URL
      Width
      Height
    }
  }
`);
