import { getKey } from '@/lib/redis';
import { verrou } from '@/lib/server/verrou';

import { type QueryResolvers } from '@/graphql/codegen/resolvers';

export const HealthQuery: QueryResolvers['Health'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const lock = verrou.createLock(getKey('verrou:/api/chat/route'));

  return {
    Ollama: (await lock.isLocked()) ? 'Service Unavailable' : 'OK',
  };
};
