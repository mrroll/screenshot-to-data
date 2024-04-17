import { type Resolvers } from '@/graphql/codegen/resolvers';
import { HealthMutation } from '@/graphql/schema/Objects/Health/mutations/health';
import { HealthQuery } from '@/graphql/schema/Objects/Health/queries/health';

export const HealthResolvers: Resolvers = {
  Query: {
    Health: HealthQuery,
  },
  Mutation: {
    Health: HealthMutation,
  },
};
