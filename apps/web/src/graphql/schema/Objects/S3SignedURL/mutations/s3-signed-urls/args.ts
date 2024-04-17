import { z } from 'zod';

export const S3SignedURLsMutationArgsSchema = z.object({
  S3SignedURLs: z
    .array(
      z.object({
        name: z.string().min(1),
      }),
    )
    .min(1)
    .max(10),
});
