import fp from 'fastify-plugin';
import createHttpError from 'http-errors';

export const errors = fp((fastify, opts, done) => {
  fastify.setNotFoundHandler(async (request, reply) => {
    if (typeof request.raw.url === 'undefined') {
      throw createHttpError(404, {
        message: `${request.method.toUpperCase()} not found.`,
      });
    }

    throw createHttpError(404, {
      message: `${request.method.toUpperCase()} ${request.raw.url} not found.`,
    });
  });

  fastify.setErrorHandler(async (error, request, reply) => {
    const isValidationError = error.statusCode === 400;

    if (isValidationError && error.statusCode !== undefined) {
      request.log.warn(error);
      void reply.code(error.statusCode);
      return error;
    }

    const isHttpError = createHttpError.isHttpError(error);

    if (isHttpError) {
      request.log.warn(error);
      void reply.code(error.status);
      request.log.fatal(error);
      return error.message;
    }

    request.log.error(error);
    void reply.code(500);
    return 'Internal Server Error';
  });

  done();
});
