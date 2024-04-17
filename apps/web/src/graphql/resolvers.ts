import { deepmerge } from 'deepmerge-ts';

import { type Resolvers } from '@/graphql/codegen/resolvers';
import { HealthResolvers } from '@/graphql/schema/Objects/Health/resolvers';
import { LockResolvers } from '@/graphql/schema/Objects/Lock/resolvers';
import { S3SignedURLResolvers } from '@/graphql/schema/Objects/S3SignedURL/resolvers';
import { ScreenshotResolvers } from '@/graphql/schema/Objects/Screenshot/resolvers';
import { UserResolvers } from '@/graphql/schema/Objects/User/resolvers';
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
  HealthResolvers,
  LockResolvers,
  S3SignedURLResolvers,
  ScreenshotResolvers,
  UserResolvers,
].reduce((previous, current) => {
  return deepmerge(previous, current);
});
