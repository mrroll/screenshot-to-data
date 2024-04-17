import { Verrou } from '@verrou/core';
import { redisStore } from '@verrou/core/drivers/redis';

import { redis } from '@/lib/server/redis';

import { config } from '@/config/server';

declare global {
  // eslint-disable-next-line no-var -- from https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution
  var __verrou: InstanceType<typeof Verrou> | undefined;
}

export const verrou =
  global.__verrou ??
  new Verrou({
    default: 'redis',
    stores: {
      redis: {
        driver: redisStore({ connection: redis }),
      },
    },
  });

if (config.NODE_ENV !== 'production') {
  global.__verrou = verrou;
}
