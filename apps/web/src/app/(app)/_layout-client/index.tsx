'use client';

import '@/app/(app)/_layout-client/globals.css';

import type * as React from 'react';
import { LoaderCircleIcon } from 'lucide-react';

import { AppLayoutClientContexts as Contexts } from '@/app/(app)/_layout-client/contexts';
import { Toaster } from '@/components/ui/sonner';

export const AppLayoutClient = (props: { children: React.ReactNode }) => {
  return (
    <Contexts>
      {props.children}

      <Toaster
        position="top-center"
        icons={{ loading: <LoaderCircleIcon className="animate-spin" /> }}
      />
    </Contexts>
  );
};
