import { type Resolvers } from '@/graphql/codegen/resolvers';
import { LockMutation } from '@/graphql/schema/Objects/Lock/mutations/create';
import { DeleteLockMutation } from '@/graphql/schema/Objects/Lock/mutations/remove';

export const LockResolvers: Resolvers = {
  Mutation: {
    Lock: LockMutation,
    DeleteLock: DeleteLockMutation,
  },
};
