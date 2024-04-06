import Image from 'next/image';
import * as React from 'react';
import { DateTime } from 'luxon';
import { isNullish } from 'remeda';

import { type AppPageScreenshotScreenshotQuery as ScreenshotQuery } from '@/app/(app)/(authenticated)/_page-screenshot/screenshot-query';
import { type AppPageScreenshotScreenshotsQuery as ScreenshotsQuery } from '@/app/(app)/(authenticated)/_page-screenshot/screenshots-query';
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/extended/magic-card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type ResultOf } from '@/graphql/graphql';
import { durationToHuman } from '@/utilities/duration-to-human';

export const AppPageScreenshotContent = (props: {
  screenshot: NonNullable<
    NonNullable<
      NonNullable<ResultOf<typeof ScreenshotsQuery>>['Screenshots']
    >[number]
  >;
  screenshotDetailed: ResultOf<typeof ScreenshotQuery> | undefined;
  enabled: boolean;
  priority: boolean;
}) => {
  const { screenshot, screenshotDetailed } = props;

  if (screenshot.UpdatedAt === null || screenshot.Description === null) {
    throw new Error(
      'One or more required properties of the Screenshot is null.',
    );
  }

  const updatedAtDate = DateTime.fromISO(screenshot.UpdatedAt);

  const duration = durationToHuman({
    Duration: DateTime.now().diff(updatedAtDate),
    simple: true,
  });

  const [quantity, measure] = duration.split(' ');

  if (typeof measure !== 'string') {
    throw new Error('measure is not defined.');
  }

  if (isNullish(screenshotDetailed?.Screenshot)) {
    return null;
  }

  const { Height, S3URL, Width } = screenshotDetailed.Screenshot;

  if (Height === null || S3URL === null || Width === null) {
    throw new Error(
      'One or more required properties of the Screenshot is null.',
    );
  }

  return (
    <React.Fragment>
      <CardHeader>
        <CardTitle>{screenshot.OriginalFilename}</CardTitle>
        <CardDescription asChild>
          <div>
            <Tooltip>
              <TooltipTrigger className="tracking-normal">
                {quantity}
                {measure[0]}
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={5}>
                <p className="tracking-normal">
                  {updatedAtDate.toLocaleString(
                    DateTime.DATETIME_FULL_WITH_SECONDS,
                  )}
                </p>
              </TooltipContent>
            </Tooltip>
            <p className="block tracking-normal">{screenshot.user?.email}</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-12">
        <Image
          alt={screenshot.Description}
          src={S3URL}
          width={Width}
          height={Height}
          priority={props.priority}
          className="mx-auto"
        />
        <div className="font-normal">
          {screenshot.Description.split('\n').map((line, index) => (
            // eslint-disable-next-line react/no-array-index-key -- There's no way to ensure uniqueness
            <p key={index}>{line}</p>
          ))}
        </div>
        <p className="font-normal">{}</p>
      </CardContent>
    </React.Fragment>
  );
};
