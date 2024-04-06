import { type Resolvers } from '@/graphql/codegen/resolvers';
import { ScreenshotsQuery } from '@/graphql/schema/Objects/Screenshot/queries/list';
import { ScreenshotQuery } from '@/graphql/schema/Objects/Screenshot/queries/read';

export const ScreenshotResolvers: Resolvers = {
  Query: {
    Screenshot: ScreenshotQuery,
    Screenshots: ScreenshotsQuery,
  },
};
