import { PrismaPackage } from '@screenshot-to-data/common/dist/prisma';
import { prismaCUID2Extension } from '@screenshot-to-data/common/dist/prisma-cuid-2-extension';
import { Duration } from 'luxon';

import { pino } from '@/lib/server/pino';

import { config } from '@/config/server';
import { durationToHuman } from '@/utilities/duration-to-human';

const logger = pino.child({ module: 'prisma' });

const getPrismaClient = () => {
  const Prisma = PrismaPackage({
    datasourceUrl: config.DATABASE_URL,
    log: [
      {
        emit: 'event',
        level: 'query',
      },
      {
        emit: 'event',
        level: 'error',
      },
      {
        emit: 'event',
        level: 'info',
      },
      {
        emit: 'event',
        level: 'warn',
      },
    ],
  });

  Prisma.$on('error', (event) => {
    // verrou intentionally fails in some SQL queriees
    if (/^verrou\./.test(event.target)) {
      // return;
    }

    logger.error(event);
  });

  Prisma.$on('warn', (event) => {
    logger.warn(event);
  });

  Prisma.$on('info', (event) => {
    logger.info(event);
  });

  Prisma.$on('query', (event) => {
    const duration = durationToHuman({
      Duration: Duration.fromMillis(event.duration),
    });

    logger.debug({ ...event, duration });
  });

  return Prisma.$extends(prismaCUID2Extension);
};

declare global {
  // eslint-disable-next-line no-var -- from https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution
  var __prisma: ReturnType<typeof getPrismaClient> | undefined;
}

export const prisma = global.__prisma ?? getPrismaClient();

if (config.NODE_ENV !== 'production') {
  global.__prisma = prisma;
}

export * from '@screenshot-to-data/common/dist/prisma';
