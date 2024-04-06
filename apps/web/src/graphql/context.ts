import { type NextApiRequest, type NextApiResponse } from 'next';
import { type User } from '@supabase/supabase-js';
import { type JwtPayload } from 'jsonwebtoken';

import { type pino } from '@/lib/server/pino';

export type TContextType = {
  req: NextApiRequest;
  res: NextApiResponse;
  logger: typeof pino;
  user: (User & JwtPayload) | null;
};
