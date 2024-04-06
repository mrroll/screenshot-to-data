import Retry from 'async-retry';
import { deepmerge } from 'deepmerge-ts';

import { pino } from '@/lib/pino';

const defaults: Retry.Options = {
  retries: 3,
  onRetry: (error, attempt) => {
    pino.warn({ msg: `Attempt ${attempt}`, error });
  },
} as const;

export const asyncRetry = <TFunction>(
  fn: Retry.RetryFunction<TFunction>,
  options?: Retry.Options,
) => {
  return Retry(fn, deepmerge(defaults, options ?? {}));
};
