import { type User } from '@supabase/supabase-js';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';

import { config } from '@/config/server';

const cookieSchema = z.string().min(1);

export const getUserFromCookie = (cookie: z.infer<typeof cookieSchema>) => {
  try {
    const value = z
      .object({
        access_token: z.string().min(1),
      })
      .parse(JSON.parse(cookie));

    const user = jwt.verify(
      value.access_token,
      config.SUPABASE_JWT_SECRET,
    ) as User & JwtPayload & { sub: string };

    if (typeof user.sub !== 'string') {
      throw new Error('Invalid sub');
    }

    return user;
  } catch (error) {
    return null;
  }
};
