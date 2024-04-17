import { z } from 'zod';

export const currentUserMutationArgsSchema = z.object({
  user_preference: z
    .object({
      Prompt: z.string().optional(),
    })
    .optional(),
});
