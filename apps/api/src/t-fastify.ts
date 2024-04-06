import { type IncomingMessage, type ServerResponse } from 'node:http';

import {
  type FastifyBaseLogger,
  type FastifyInstance,
  type FastifyTypeProviderDefault,
  type RawServerDefault,
} from 'fastify';

export type TFastify = FastifyInstance<
  RawServerDefault,
  IncomingMessage,
  ServerResponse<IncomingMessage>,
  FastifyBaseLogger,
  FastifyTypeProviderDefault
>;
