import { type FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

import { errors } from '@/plugins/errors';
import { helmet } from '@/plugins/helmet';
// import { llamaCPP } from '@/plugins/llama-cpp';
import { nodeGraceful } from '@/plugins/node-graceful';
import { swagger } from '@/plugins/swagger';
import { zod } from '@/plugins/zod';

export const plugins = fp(async (fastify, opts: FastifyPluginOptions) => {
  await fastify.register(errors);
  await fastify.register(helmet);
  await fastify.register(nodeGraceful);
  await fastify.register(zod);
  await fastify.register(swagger, opts);
  // await fastify.register(llamaCPP, opts);
});
