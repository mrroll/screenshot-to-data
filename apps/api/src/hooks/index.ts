import { type FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

import { authentication } from '@/hooks/authentication';

export const hooks = fp(async (fastify, opts: FastifyPluginOptions) => {
  await fastify.register(authentication, opts);
});
