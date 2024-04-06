import { match, P } from 'ts-pattern';

import { config } from '@/config/client';
import { PRODUCTION_URL } from '@/constants/URLS';

export const getHost = () =>
  match({
    NEXT_PUBLIC_VERCEL_ENV: config.NEXT_PUBLIC_VERCEL_ENV,
    NEXT_PUBLIC_VERCEL_URL: config.NEXT_PUBLIC_VERCEL_URL,
  })
    .with(
      {
        NEXT_PUBLIC_VERCEL_ENV: 'preview',
        NEXT_PUBLIC_VERCEL_URL: P.not(undefined),
      },
      ({ NEXT_PUBLIC_VERCEL_URL }) => {
        return `https://${NEXT_PUBLIC_VERCEL_URL}`;
      },
    )
    .with(
      {
        NEXT_PUBLIC_VERCEL_ENV: 'production',
      },
      () => {
        return PRODUCTION_URL;
      },
    )
    .otherwise(() => `http://localhost:${config.NEXT_PUBLIC_PORT}`);
