import { verrou } from '@/lib/server/verrou';

import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { deleteLockMutationArgs } from '@/graphql/schema/Objects/Lock/mutations/remove/args';

export const DeleteLockMutation: MutationResolvers['DeleteLock'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const args = deleteLockMutationArgs.parse(argsRaw);

  const lock = verrou.restoreLock(args.options);

  await lock.release();

  return null;
};
