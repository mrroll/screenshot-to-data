import Graceful from 'node-graceful';

import { pino } from '@/lib/pino';
import { prisma } from '@/lib/prisma';
import { workspacePrisma } from '@/lib/workspace-prisma';

export const gracefulExit = () => {
  Graceful.captureExceptions = true;
  Graceful.captureRejections = true;

  Graceful.on('exit', async (reason, error) => {
    pino.info({ msg: 'Closing database connections.' });

    await Promise.all([prisma.$disconnect(), workspacePrisma.$disconnect()]);

    pino.info({ msg: 'Database connections closed.' });

    if (reason === 'uncaughtException' || reason === 'unhandledRejection') {
      pino.fatal({ msg: `Exiting due to ${reason}` });
      // eslint-disable-next-line no-console -- Attempting to log this with pino results in an empty object.
      console.error(error);
    }
  });
};
