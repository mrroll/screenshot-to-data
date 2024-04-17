import { verrou } from '@/lib/server/verrou';

import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { lockRemoveMutationArgsSchema } from '@/graphql/schema/Objects/Lock/mutations/lock-remove/args';

export const LockRemoveMutation: MutationResolvers['LockRemove'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const args = lockRemoveMutationArgsSchema.parse(argsRaw);

  const lock = verrou.restoreLock(args);

  await lock.release();

  return null;
};
