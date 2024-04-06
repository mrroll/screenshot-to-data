import { type Resolvers } from '@/graphql/codegen/resolvers';
import { HealthQuery } from '@/graphql/schema/Objects/Health/query';

export const HealthResolvers: Resolvers = {
  Query: {
    Health: HealthQuery,
  },
};
