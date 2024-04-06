import type * as React from 'react';

import { TooltipProvider } from '@/components/ui/tooltip';

export const AppLayoutClientContextsTooltip = (props: {
  children: React.ReactNode;
}) => {
  return <TooltipProvider>{props.children}</TooltipProvider>;
};
