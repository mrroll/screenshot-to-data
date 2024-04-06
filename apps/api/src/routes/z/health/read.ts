import fp from 'fastify-plugin';
import { type ZodTypeProvider } from 'fastify-type-provider-zod';
import createHttpError from 'http-errors';
import { z } from 'zod';

export const read = fp((fastify, opts, done) => {
  fastify.withTypeProvider<ZodTypeProvider>().route({
    method: 'GET',

    url: '/z/health',

    schema: {
      response: {
        200: z.string(),
      },
    },

    handler: async (request, reply) => {
      void reply.code(200);

      if (typeof request.id !== 'string') {
        throw createHttpError(500);
      }

      return `2 api | Request ID: ${request.id}`;
    },
  });

  done();
});
