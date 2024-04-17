import { type Resolvers } from '@/graphql/codegen/resolvers';
import { CurrentUserMutation } from '@/graphql/schema/Objects/User/mutations/current-user';
import { CurrentUserQuery } from '@/graphql/schema/Objects/User/queries/current-user';

export const UserResolvers: Resolvers = {
  Query: {
    CurrentUser: CurrentUserQuery,
  },
  Mutation: {
    CurrentUser: CurrentUserMutation,
  },
};
