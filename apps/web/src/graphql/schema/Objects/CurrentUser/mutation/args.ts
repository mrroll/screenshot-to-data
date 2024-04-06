import { z } from 'zod';

export const currentUserMutationArgs = z.object({
  options: z.object({
    user_preference: z
      .object({
        Prompt: z.string().optional(),
      })
      .optional(),
  }),
});
