import { PrismaPackage } from '@screenshot-to-data/common/dist/prisma';
import { prismaCUID2Extension } from '@screenshot-to-data/common/dist/prisma-cuid-2';
import { Duration } from 'luxon';

import { config } from '@/config';
import { pino } from '@/lib/pino';
import { durationToHuman } from '@/utilities/duration-to-human';

const logger = pino.child({ module: 'prisma' });

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

export const prisma = Prisma.$extends(prismaCUID2Extension);
