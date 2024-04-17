import { z } from 'zod';

export const lockMutationArgsSchema = z.object({
  key: z.enum(['verrou:/api/chat/route'] as const),
  ttl: z.number().optional(),
});
