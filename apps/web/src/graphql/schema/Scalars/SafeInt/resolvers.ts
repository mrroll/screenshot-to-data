import { SafeIntResolver } from 'graphql-scalars';

import { type Resolvers } from '@/graphql/codegen/resolvers';

export const SafeIntResolvers: Resolvers = {
  SafeInt: SafeIntResolver,
};
