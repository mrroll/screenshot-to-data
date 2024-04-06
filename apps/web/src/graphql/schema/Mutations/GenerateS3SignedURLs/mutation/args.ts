import { z } from 'zod';

export const generateS3SignedURLsArgs = z.object({
  options: z
    .array(
      z.object({
        name: z.string().min(1),
      }),
    )
    .min(1)
    .max(10),
});
