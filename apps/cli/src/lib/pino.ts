import { pino as Pino } from 'pino';

import { config } from '@/config';

export const pino = Pino({ level: config.PINO_LEVEL });
