import { Duration, type DurationObjectUnits } from 'luxon';

export const durationToHuman = (options: { Duration: Duration<true> }) => {
  const duration = options.Duration.shiftTo(
    'years',
    'days',
    'hours',
    'minutes',
    'seconds',
    'milliseconds',
  ).toObject();

  const cleanedDuration = Object.fromEntries(
    Object.entries(duration)
      .filter(([_key, value]) => value !== 0)
      .map(([key, value]) => [key, Math.abs(value as number)]),
  ) as DurationObjectUnits;

  if (Object.keys(cleanedDuration).length === 0) {
    cleanedDuration.milliseconds = 0;
  }

  return Duration.fromObject(cleanedDuration).toHuman();
};
