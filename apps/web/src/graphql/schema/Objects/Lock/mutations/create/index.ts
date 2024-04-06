import { verrou } from '@/lib/server/verrou';
import { getLock } from '@/lib/verrou';

import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { lockMutationArgs } from '@/graphql/schema/Objects/Lock/mutations/create/args';

export const LockMutation: MutationResolvers['Lock'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const args = lockMutationArgs.parse(argsRaw);

  const lock = verrou.createLock(getLock(args.options.key), args.options.ttl);

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
