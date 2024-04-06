import type * as React from 'react';

import { AppLayoutClient as LayoutClient } from '@/app/(app)/_layout-client';

const AppLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return <LayoutClient>{children}</LayoutClient>;
};

export default AppLayout;
