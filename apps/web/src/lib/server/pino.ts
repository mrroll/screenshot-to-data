import { pino as Pino } from 'pino';

import { config } from '@/config/server';

export const pino = Pino({ level: config.PINO_LEVEL });
