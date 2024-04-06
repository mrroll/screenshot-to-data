import { verrou } from '@/lib/server/verrou';
import { getLock } from '@/lib/verrou';

import { type QueryResolvers } from '@/graphql/codegen/resolvers';

export const HealthQuery: QueryResolvers['Health'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const lock = verrou.createLock(getLock('/api/chat/route'));

  return {
    Ollama: (await lock.isLocked()) ? 'Service Unavailable' : 'OK',
  };
};
