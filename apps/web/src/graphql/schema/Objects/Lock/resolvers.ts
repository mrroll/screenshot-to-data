import { type Resolvers } from '@/graphql/codegen/resolvers';
import { LockMutation } from '@/graphql/schema/Objects/Lock/mutations/lock';
import { LockRemoveMutation } from '@/graphql/schema/Objects/Lock/mutations/lock-remove';

export const LockResolvers: Resolvers = {
  Mutation: {
    Lock: LockMutation,
    LockRemove: LockRemoveMutation,
  },
};
