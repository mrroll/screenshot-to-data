import { z } from 'zod';

import { shared } from '@/config/shared';

export const config = z
  .object({
    // Next.js
    NEXT_PUBLIC_PORT: z.coerce.number().default(3000),
    NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
    NEXT_PUBLIC_VERCEL_ENV: z.string().optional().default('development'),
  })
  .merge(shared)
  .parse(
    // https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
    {
      // Next.js
      NEXT_PUBLIC_PORT: process.env.NEXT_PUBLIC_PORT,
      NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
      NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,

      // Supabase
      NEXT_PUBLIC_SUPABASE_APP_ID: process.env.NEXT_PUBLIC_SUPABASE_APP_ID,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_COOKIE_NAME:
        process.env.NEXT_PUBLIC_SUPABASE_COOKIE_NAME,

      // AWS
      NEXT_PUBLIC_S3_BUCKET_PREFIX: process.env.NEXT_PUBLIC_S3_BUCKET_PREFIX,
    },
  );
