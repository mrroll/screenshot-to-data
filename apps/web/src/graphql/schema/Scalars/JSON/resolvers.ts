import { JSONResolver } from 'graphql-scalars';

import { type Resolvers } from '@/graphql/codegen/resolvers';

export const JSONResolvers: Resolvers = {
  JSON: JSONResolver,
};
