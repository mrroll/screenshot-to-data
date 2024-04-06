import { Verrou } from '@verrou/core';
import { redisStore } from '@verrou/core/drivers/redis';
import { Redis } from 'ioredis';

import { config } from '@/config/server';

const redis = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  keyPrefix: `magic-analytics:web:verrou:${config.REDIS_KEY_PREFIX}`,
});

export const verrou = new Verrou({
  default: 'redis',
  stores: {
    redis: {
      driver: redisStore({ connection: redis }),
    },
  },
});
