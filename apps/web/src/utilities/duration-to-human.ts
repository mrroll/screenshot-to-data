import { Duration, type DurationObjectUnits } from 'luxon';
import { z } from 'zod';

const optionsSchema = z.object({
  simple: z.boolean().default(false).optional(),
});

export const durationToHuman = (
  options: { Duration: Duration<true> } & z.infer<typeof optionsSchema>,
) => {
  const args = optionsSchema.parse(options);

  const duration = options.Duration.shiftTo(
    'years',
    'months',
    'weeks',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
  ).toObject();

  const cleanedDurationEntries = Object.entries(duration)
    .filter(([_key, value]) => value !== 0)
    .map(([key, value]) => [key, Math.abs(value as number)]);

  const simpleCleanedDurationEntries = cleanedDurationEntries[0];

  const cleanedDuration = Object.fromEntries(
    args.simple && typeof simpleCleanedDurationEntries !== 'undefined'
      ? [simpleCleanedDurationEntries]
      : cleanedDurationEntries,
  ) as DurationObjectUnits;

  if (Object.keys(cleanedDuration).length === 0) {
    cleanedDuration.milliseconds = 0;
  }

  return Duration.fromObject(cleanedDuration).toHuman();
};
