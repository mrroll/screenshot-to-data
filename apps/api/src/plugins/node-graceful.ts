import { type FastifyPluginOptions } from 'fastify';
import fp from 'fastify-plugin';
import Graceful from 'node-graceful';

Graceful.captureExceptions = true;
Graceful.captureRejections = true;

const SIGINTListeners = process.listeners('SIGINT');
process.removeAllListeners('SIGINT');

const SIGTERMListeners = process.listeners('SIGTERM');
process.removeAllListeners('SIGTERM');

const SIGQUITListeners = process.listeners('SIGQUIT');
process.removeAllListeners('SIGQUIT');

let isPluginLoaded = false;

Graceful.on('exit', (signal, details) => {
  if (isPluginLoaded === true) {
    return null;
  }

  console.error(
    '+++ ERROR: An uncaught exception or unhandled rejection was encountered before the fastify plugin for node-graceful was loaded.',
    { signal, details },
  );
});

export const nodeGraceful = fp((fastify, opts: FastifyPluginOptions, done) => {
  Graceful.on('exit', async (signal, details) => {
    fastify.log.info({ signal, details }, 'node-graceful triggered.');

    // await fastify.llamaCPPServerProcess?.kill();

    if (signal === 'unhandledRejection' || signal === 'uncaughtException') {
      fastify.log.fatal(details);
    }

    fastify.log.info('Closing fastify.');
    await fastify.close();

    switch (signal) {
      case 'SIGINT':
        SIGINTListeners.forEach((listener) => {
          listener(signal);
        });
        break;

      case 'SIGTERM':
        SIGTERMListeners.forEach((listener) => {
          listener(signal);
        });
        break;

      case 'SIGQUIT':
        SIGQUITListeners.forEach((listener) => {
          listener(signal);
        });
        break;

      default:
        break;
    }
  });

  isPluginLoaded = true;

  done();
});
