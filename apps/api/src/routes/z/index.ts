import fp from 'fastify-plugin';

import { health } from '@/routes/z/health';

export const z = fp(async (fastify) => {
  await fastify.register(health);
});
