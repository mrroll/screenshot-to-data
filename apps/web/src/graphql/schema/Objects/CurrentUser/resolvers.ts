import { type Resolvers } from '@/graphql/codegen/resolvers';
import { CurrentUserMutation } from '@/graphql/schema/Objects/CurrentUser/mutation';
import { CurrentUserQuery } from '@/graphql/schema/Objects/CurrentUser/query';

export const CurrentUserResolvers: Resolvers = {
  Query: {
    CurrentUser: CurrentUserQuery,
  },
  Mutation: {
    CurrentUser: CurrentUserMutation,
  },
};
