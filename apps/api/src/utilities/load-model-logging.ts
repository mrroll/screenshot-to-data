import { type ValueOf } from 'type-fest';
import { z } from 'zod';
import { type ProcessPromise } from 'zx';

import { FASTIFY_LOGGER_LEVEL } from '@/config';
import { type TFastify } from '@/t-fastify';

const logLevelMap = { INFO: 'info', WARN: 'warn', ERR: 'error' } as const;

const logSchema = z
  .object({
    level: z.string(),
    message: z.string(),
  })
  .passthrough()
  .transform((object) => {
    const { level: originalLevel, ...rest } = object;

    const level = logLevelMap[originalLevel as keyof typeof logLevelMap] as
      | ValueOf<typeof logLevelMap>
      | undefined;

    return { level, ...rest };
  });

const callback = ({ fastify, data }: { fastify: TFastify; data: Buffer }) => {
  try {
    const parsed = logSchema.parse(JSON.parse(data.toString()));

    if (typeof parsed.level === 'undefined') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- Extract the rest
    const { level, ...rest } = parsed;

    fastify.log[FASTIFY_LOGGER_LEVEL](rest);
  } catch (error) {
    if (error instanceof SyntaxError !== true) {
      throw error;
    }

    const logger = fastify.log.child({}, { level: 'info' });

    const string = data.toString();

    if (string === '.') {
      return;
    }

    logger.info({ message: data.toString() });
  }
};

export const loadModelLogging = ({
  fastify,
  processPromise,
}: {
  fastify: TFastify;
  processPromise: ProcessPromise;
}) => {
  processPromise.stderr.on('data', (data: Buffer) =>
    callback({ fastify, data }),
  );
  processPromise.stdout.on('data', (data: Buffer) =>
    callback({ fastify, data }),
  );
};
