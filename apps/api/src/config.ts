import { z } from 'zod';

const NODE_ENV = z
  .union([
    z.literal('development'),
    z.literal('production'),
    z.literal('test'),
    z.undefined(),
  ])
  .default('development')
  .parse(process.env.NODE_ENV);

export const FASTIFY_LOGGER_LEVEL = z
  .union([
    z.literal('fatal'),
    z.literal('error'),
    z.literal('warn'),
    z.literal('info'),
    z.literal('debug'),
    z.literal('trace'),
    z.undefined(),
  ])
  .default(() => {
    switch (NODE_ENV) {
      case 'production':
        return 'error';

      case 'development':
      default:
        return 'info';
    }
  })
  .parse(process.env.FASTIFY_LOGGER_LEVEL);

export const config = {
  NODE_ENV,
  FASTIFY_LOGGER_LEVEL,
  ...z
    .object({
      FASTIFY_PORT: z.number().int().min(3000).default(4000),
      FASTIFY_PREFIX: z.string().default(''),
    })
    .parse(process.env),
};
