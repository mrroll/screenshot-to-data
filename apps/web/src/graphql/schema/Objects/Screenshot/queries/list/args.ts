import { z } from 'zod';

const MAX_LIMIT = 100;
const DEFAULT_SORT = 'desc';
const DEFAULT_SORT_FIELD = 'UpdatedAt';

export const screenshotsQueryArgsSchema = z
  .object({
    options: z
      .object({
        first: z.number().positive().max(MAX_LIMIT).optional(),
        after: z.string().optional(),
        last: z.number().positive().max(MAX_LIMIT).optional(),
        before: z.string().optional(),
        orderBy: z.literal('UpdatedAt').optional().default(DEFAULT_SORT_FIELD),
        orderByDirection: z
          .union([z.literal('asc'), z.literal('desc')])
          .optional()
          .default(DEFAULT_SORT),
      })
      .optional()
      .default({}),
  })
  .optional();
