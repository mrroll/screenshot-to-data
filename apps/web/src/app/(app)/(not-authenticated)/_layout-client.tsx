'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';

import { AUTH_STATUSES, useUser } from '@/hooks/use-user';

export const AppNotAuthenticatedLayoutClient = (props: {
  children: React.ReactNode;
}) => {
  const { children } = props;

  const { status } = useUser();

  const router = useRouter();

  // Warning: Cannot update a component (`Router`) while rendering a different component
  React.useEffect(() => {
    if (status === AUTH_STATUSES.LOADING) {
      return;
    }

    if (status === AUTH_STATUSES.AUTHORIZED) {
      router.push('/');
    }
  }, [status, router]);

  if (status === AUTH_STATUSES.LOADING || status === AUTH_STATUSES.AUTHORIZED) {
    return null;
  }

  return (
    <div className="min-w-screen flex min-h-screen items-center justify-center">
      {children}
    </div>
  );
};
