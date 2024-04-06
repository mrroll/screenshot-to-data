import { DateTime } from 'luxon';
import { z } from 'zod';

const commands = z.enum([
  'describe-local-files',
  'describe-database-files',
] as const);

const datetimeRefine = (
  value: DateTime<true> | DateTime<false>,
): value is DateTime<true> => value.isValid;

export const cliArgsSchema = z
  .object({
    _: z.tuple([commands]),
  })
  .passthrough()
  .transform((value) => {
    return { ...value, _: value._[0] };
  })
  .pipe(
    z.discriminatedUnion('_', [
      // Each object is a command with its arguments
      z.object({
        _: z.literal(commands.enum['describe-local-files']),
        files: z.string().min(1),
      }),
      z.object({
        _: z.literal(commands.enum['describe-database-files']),
        take: z.coerce.number().default(10),
        'cursor-id': z.string().min(1).optional(),
        'cursor-created-at': z
          .string()
          .min(1)
          .transform((value) => DateTime.fromSQL(value))
          .refine(datetimeRefine, {
            message: 'Invalid DateTime',
          }),
      }),
    ]),
  );
