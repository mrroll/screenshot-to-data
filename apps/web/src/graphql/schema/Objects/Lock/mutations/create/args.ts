import { z } from 'zod';

export const lockMutationArgs = z.object({
  options: z.object({
    key: z.enum(['/api/chat/route']),
    ttl: z.number().optional(),
  }),
});
