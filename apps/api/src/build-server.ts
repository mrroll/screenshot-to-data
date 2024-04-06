import Fastify from 'fastify';

import { config } from '@/config';
import { hooks } from '@/hooks';
import { plugins } from '@/plugins';
import { routes } from '@/routes';

interface IOptions {
  prefix: string | undefined;
}

const fastify = Fastify({
  logger: { level: config.FASTIFY_LOGGER_LEVEL },
  trustProxy: true,
  ajv: {
    customOptions: {
      strict: 'log',
      keywords: ['kind', 'modifier'],
    },
  },
  ...(['development', 'test'].some((item) => item === process.env.NODE_ENV) && {
    forceCloseConnections: true,
  }),
});

export const buildServer = async () => {
  const options: IOptions = { prefix: config.FASTIFY_PREFIX };

  await fastify.register(plugins, options);
  await fastify.register(hooks, options);
  await fastify.register(routes, options);

  return fastify;
};
