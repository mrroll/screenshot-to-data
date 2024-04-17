import { type Resolvers } from '@/graphql/codegen/resolvers';
import { ScreenshotQuery } from '@/graphql/schema/Objects/Screenshot/queries/screenshot';
import { ScreenshotsQuery } from '@/graphql/schema/Objects/Screenshot/queries/screenshots';

export const ScreenshotResolvers: Resolvers = {
  Query: {
    Screenshot: ScreenshotQuery,
    Screenshots: ScreenshotsQuery,
  },
};
