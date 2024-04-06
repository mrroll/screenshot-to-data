import path from 'node:path';

import { type FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import { jsonSchemaTransform } from 'fastify-type-provider-zod';

export const swagger = fp(async (fastify, opts: FastifyPluginOptions) => {
  await fastify.register(import('@fastify/swagger'), {
    openapi: {
      info: {
        title: 'api',
        description: 'Documentation.',
        version: '1.0.0',
      },
      servers: [],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
    transform: jsonSchemaTransform,
  });

  await fastify.register(import('@fastify/swagger-ui'), {
    routePrefix: path.join((opts.prefix as string) || '', '/documentation'),
  });
});
