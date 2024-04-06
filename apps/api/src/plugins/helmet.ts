import fp from 'fastify-plugin';

export const helmet = fp(async (fastify) => {
  await fastify.register(import('@fastify/helmet'));
});
