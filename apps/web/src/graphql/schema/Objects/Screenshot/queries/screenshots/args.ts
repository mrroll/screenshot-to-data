import { z } from 'zod';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;
const DEFAULT_SORT = 'desc';
const DEFAULT_SORT_FIELD = 'UpdatedAt';

export const screenshotsQueryArgsSchema = z.object({
  first: z.number().positive().max(MAX_LIMIT).optional(),
  after: z.string().optional(),
  last: z.number().positive().max(MAX_LIMIT).optional(),
  before: z.string().optional(),
  limit: z.number().positive().max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  orderBy: z.literal('UpdatedAt').optional().default(DEFAULT_SORT_FIELD),
  orderByDirection: z
    .union([z.literal('asc'), z.literal('desc')])
    .optional()
    .default(DEFAULT_SORT),
});
