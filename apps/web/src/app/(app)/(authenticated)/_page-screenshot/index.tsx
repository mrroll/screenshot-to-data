import * as React from 'react';
import { useIntersectionObserver } from '@react-hookz/web';
import { match } from 'ts-pattern';

import { AppPageScreenshotContent as Content } from '@/app/(app)/(authenticated)/_page-screenshot/content';
import { AppPageScreenshotScreenshotQuery as ScreenshotQuery } from '@/app/(app)/(authenticated)/_page-screenshot/screenshot-query';
import { type AppPageScreenshotScreenshotsQuery as ScreenshotsQuery } from '@/app/(app)/(authenticated)/_page-screenshot/screenshots-query';
import { Card } from '@/components/extended/magic-card';
import { type ResultOf } from '@/graphql/graphql';
import { useGraphQLQuery } from '@/hooks/use-graphql-query';
import { cn } from '@/utilities/client/cn';

export const AppPageScreenshot = (props: {
  screenshot: NonNullable<
    NonNullable<
      NonNullable<ResultOf<typeof ScreenshotsQuery>>['Screenshots']
    >[number]
  >;
  priority: boolean;
}) => {
  if (
    props.screenshot.UpdatedAt === null ||
    props.screenshot.Description === null
  ) {
    throw new Error(
      'One or more required properties of the Screenshot is null.',
    );
  }

  const ref = React.useRef(null);

  const observer = useIntersectionObserver(ref);

  const [previouslyEnabled, setPreviouslyEnabled] = React.useState(false);

  const enabled = match({ observer, previouslyEnabled })
    .with(
      { observer: { isIntersecting: true } },
      { previouslyEnabled: true },
      () => {
        return true;
      },
    )
    .otherwise(() => false);

  const { data: screenshotDetailed } = useGraphQLQuery({
    queryKey: [ScreenshotQuery, { CUID2: props.screenshot.CUID2 }],
    enabled,
  });

  if (previouslyEnabled !== true && enabled === true) {
    setPreviouslyEnabled(true);
  }

  return (
    <Card
      ref={ref}
      key={props.screenshot.CUID2}
      className={cn(
        'space-y-8',
        typeof screenshotDetailed === 'undefined' && 'border-none',
      )}
    >
      <Content
        enabled={enabled}
        screenshot={props.screenshot}
        screenshotDetailed={screenshotDetailed}
        priority={props.priority}
      />
    </Card>
  );
};
