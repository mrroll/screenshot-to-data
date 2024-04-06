import { type FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

// import { v1 } from '@/routes/v1';
import { z } from '@/routes/z';

export const routes = fp(async (Fastify, opts: FastifyPluginOptions) => {
  await Fastify.register(async (fastify) => {
    // await fastify.register(v1);
    await fastify.register(z);
  }, opts);
});
