import fp from 'fastify-plugin';

import { read } from '@/routes/z/health/read';

export const health = fp(async (fastify) => {
  fastify.addHook('onRoute', (options) => {
    if (options.path === `${options.prefix}/z/health/read`) {
      options.logLevel = 'error' as const;
    }
  });

  await fastify.register(read);
});
