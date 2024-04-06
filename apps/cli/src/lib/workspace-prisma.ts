import { PrismaPackage } from '@screenshot-to-data/common/dist/workspace-prisma';
import { Duration } from 'luxon';

import { config } from '@/config';
import { pino } from '@/lib/pino';
import { durationToHuman } from '@/utilities/duration-to-human';

const logger = pino.child({ module: 'workspace-prisma' });

export const workspacePrisma = PrismaPackage({
  datasourceUrl: config.WORKSPACE_DATABASE_URL,
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

workspacePrisma.$on('error', (event) => {
  logger.error(event);
});

workspacePrisma.$on('warn', (event) => {
  logger.warn(event);
});

workspacePrisma.$on('info', (event) => {
  logger.info(event);
});

workspacePrisma.$on('query', (event) => {
  const duration = durationToHuman({
    Duration: Duration.fromMillis(event.duration),
  });

  logger.debug({ ...event, duration });
});
