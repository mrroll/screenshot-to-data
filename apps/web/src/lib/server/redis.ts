import { Redis } from 'ioredis';

import { config } from '@/config/server';

declare global {
  // eslint-disable-next-line no-var -- from https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution
  var __redis: InstanceType<typeof Redis> | undefined;
}

export const redis =
  global.__redis ??
  new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    keyPrefix: `magic-analytics:web:${config.REDIS_KEY_PREFIX}`,
  });

if (config.NODE_ENV !== 'production') {
  global.__redis = redis;
}
