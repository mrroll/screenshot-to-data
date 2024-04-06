import type * as React from 'react';

import { AppNotAuthenticatedLayoutClient as LayoutClient } from '@/app/(app)/(not-authenticated)/_layout-client';

const AppNotAuthenticatedLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return <LayoutClient>{children}</LayoutClient>;
};

export default AppNotAuthenticatedLayout;
