import type { FastifyInstance } from 'fastify';
import { afterAll } from 'vitest';

import { buildServer } from '@/build-server';

let fastify: FastifyInstance | undefined;

afterAll(async () => {
  fastify?.log.info('afterAll triggered.');

  fastify?.log.info('Closing fastify.');
  await fastify?.close();
});

export const buildFastify = async () => {
  if (fastify === undefined) {
    fastify = await buildServer();
  }

  return fastify;
};
