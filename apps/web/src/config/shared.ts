import { z } from 'zod';

const NEXT_PUBLIC_SUPABASE_APP_ID = z
  .string()
  .optional()
  .default('gywhvnrzrumirdvuefno');

const SUPABASE_APP_ID = NEXT_PUBLIC_SUPABASE_APP_ID.parse(
  process.env.NEXT_PUBLIC_SUPABASE_APP_ID,
);

export const shared = z.object({
  // Supabase
  NEXT_PUBLIC_SUPABASE_APP_ID,
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .optional()
    .default(`https://${SUPABASE_APP_ID}.supabase.co`),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .optional()
    .default(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5d2h2bnJ6cnVtaXJkdnVlZm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA4NTg0NzMsImV4cCI6MjAyNjQzNDQ3M30.KZ7rbWLdN2Z9L_a6q48PHjtoo9JyZpxGRYyAU2uga8Y',
    ),
  NEXT_PUBLIC_SUPABASE_COOKIE_NAME: z
    .string()
    .optional()
    .default(`sb-${SUPABASE_APP_ID}-auth-token`),

  // AWS
  NEXT_PUBLIC_S3_BUCKET_PREFIX: z.string().optional().default('development/'),
});

shared.parse({});
