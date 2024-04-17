import { getKey } from '@/lib/redis';
import { verrou } from '@/lib/server/verrou';

import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { lockMutationArgsSchema } from '@/graphql/schema/Objects/Lock/mutations/lock/args';

export const LockMutation: MutationResolvers['Lock'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const args = lockMutationArgsSchema.parse(argsRaw);

  const lock = verrou.createLock(getKey(args.key), args.ttl);

  const acquired = await lock.acquire({ retry: { attempts: 1 } });

  if (acquired !== true) {
    return {
      key: null,
      owner: null,
      ttl: null,
      expirationTime: null,
    };
  }

  return lock.serialize();
};
