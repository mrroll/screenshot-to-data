import type * as React from 'react';

import { AppAuthenticatedLayoutClient as LayoutClient } from '@/app/(app)/(authenticated)/_layout-client';

const AppAuthenticatedLayout = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return <LayoutClient>{children}</LayoutClient>;
};

export default AppAuthenticatedLayout;
