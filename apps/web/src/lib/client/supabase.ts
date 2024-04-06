import { createBrowserClient as createBrowserClientSupabase } from '@supabase/ssr';

import { config } from '@/config/client';

export const createBrowserClient = () => {
  return createBrowserClientSupabase(
    config.NEXT_PUBLIC_SUPABASE_URL,
    config.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      // Make typescript happy by adding the cookies object. It gets overwritten by defaults.
      // https://github.com/supabase/auth-helpers/blob/84ef39c4a498a94717660842a20df3d10b86c794/packages/ssr/src/createBrowserClient.ts#L145
      cookies: {},
      cookieOptions: {
        name: config.NEXT_PUBLIC_SUPABASE_COOKIE_NAME,
      },
    },
  );
};
