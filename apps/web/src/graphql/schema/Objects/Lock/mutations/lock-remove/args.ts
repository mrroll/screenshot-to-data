import { z } from 'zod';

export const lockRemoveMutationArgsSchema = z.object({
  key: z.string(),
  owner: z.string(),
  ttl: z.number().nullable(),
  expirationTime: z.number().nullable(),
});
