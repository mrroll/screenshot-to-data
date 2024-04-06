import { type FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';

// import createHttpError from 'http-errors';

// import { config } from '@/config';

export const authentication = fp(
  (fastify, opts: FastifyPluginOptions, done) => {
    fastify.addHook('preHandler', async (request, reply) => {
      if (
        request.url.startsWith(`${opts.prefix}/documentation`) ||
        request.url.startsWith(`${opts.prefix}/z/health`)
      ) {
        return done();
      }
      // if (
      //   request.headers.authorization !== `Bearer ${config.LLAMA_CPP_API_KEY}`
      // ) {
      //   throw createHttpError(401);
      // }
    });

    done();
  },
);
