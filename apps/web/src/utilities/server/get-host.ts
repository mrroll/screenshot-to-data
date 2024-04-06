import { match, P } from 'ts-pattern';

import { config } from '@/config/server';
import { PRODUCTION_URL } from '@/constants/URLS';

export const getHost = () =>
  match({
    VERCEL_ENV: config.VERCEL_ENV,
    VERCEL_URL: config.VERCEL_URL,
  })
    .with(
      {
        VERCEL_ENV: 'preview',
        VERCEL_URL: P.not(undefined),
      },
      ({ VERCEL_URL }) => {
        return `https://${VERCEL_URL}`;
      },
    )
    .with(
      {
        VERCEL_ENV: 'production',
      },
      () => {
        return PRODUCTION_URL;
      },
    )
    .otherwise(() => `http://localhost:${config.PORT}`);
