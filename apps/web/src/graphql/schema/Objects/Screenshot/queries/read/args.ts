import { z } from 'zod';

export const screenshotQueryArgsSchema = z.object({
  CUID2: z.string(),
});
