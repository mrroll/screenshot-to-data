import { type NextRequest } from 'next/server';
import { type User } from '@supabase/supabase-js';
import { type JwtPayload } from 'jsonwebtoken';

import { type pino } from '@/lib/server/pino';

export type TContextType = {
  req: NextRequest;
  logger: typeof pino;
  user: (User & JwtPayload) | null;
};
