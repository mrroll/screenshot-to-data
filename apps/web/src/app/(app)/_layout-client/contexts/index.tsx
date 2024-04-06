import type * as React from 'react';

import { AppLayoutClientContextsQueryClient as QueryClient } from '@/app/(app)/_layout-client/contexts/query-client';
import { AppLayoutClientContextsTheme as Theme } from '@/app/(app)/_layout-client/contexts/theme';
import { AppLayoutClientContextsTooltip as Tooltip } from '@/app/(app)/_layout-client/contexts/tooltip';

export const AppLayoutClientContexts = (props: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClient>
      <Theme>
        <Tooltip>{props.children}</Tooltip>
      </Theme>
    </QueryClient>
  );
};
