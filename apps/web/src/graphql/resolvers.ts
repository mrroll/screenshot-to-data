import { deepmerge } from 'deepmerge-ts';

import { type Resolvers } from '@/graphql/codegen/resolvers';
import { GenerateS3SignedURLsResolvers } from '@/graphql/schema/Mutations/GenerateS3SignedURLs/resolvers';
import { CurrentUserResolvers } from '@/graphql/schema/Objects/CurrentUser/resolvers';
import { HealthResolvers } from '@/graphql/schema/Objects/Health/resolvers';
import { LockResolvers } from '@/graphql/schema/Objects/Lock/resolvers';
import { ScreenshotResolvers } from '@/graphql/schema/Objects/Screenshot/resolvers';
import { DateTimeISOResolvers } from '@/graphql/schema/Scalars/DateTimeISO/resolvers';
import { JSONResolvers } from '@/graphql/schema/Scalars/JSON/resolvers';
import { SafeIntResolvers } from '@/graphql/schema/Scalars/SafeInt/resolvers';
import { VoidResolvers } from '@/graphql/schema/Scalars/Void/resolvers';

export const resolvers: Resolvers = [
  // Scalars
  DateTimeISOResolvers,
  JSONResolvers,
  SafeIntResolvers,
  VoidResolvers,

  // Objects
  CurrentUserResolvers,
  HealthResolvers,
  LockResolvers,
  ScreenshotResolvers,

  // Mutations
  GenerateS3SignedURLsResolvers,
].reduce((previous, current) => {
  return deepmerge(previous, current);
});
