import { VoidResolver } from 'graphql-scalars';

import { type Resolvers } from '@/graphql/codegen/resolvers';

export const VoidResolvers: Resolvers = {
  Void: VoidResolver,
};
