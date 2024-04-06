import * as React from 'react';
import { type AuthChangeEvent } from '@supabase/supabase-js';

import { createBrowserClient } from '@/lib/client/supabase';

const supabase = createBrowserClient();

let listeners: Array<() => void> = [];
let supabaseStoreLastEvent: AuthChangeEvent | null = null;

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const supabaseStore: {
  subscribe: Parameters<typeof React.useSyncExternalStore>[0];
  getSnapshot: () => AuthChangeEvent | null;
  getServerSnapshot: () => null;
} = {
  subscribe: (onStoreChange) => {
    listeners = [...listeners, onStoreChange];

    const subscription = supabase.auth.onAuthStateChange((event, session) => {
      supabaseStoreLastEvent = event;
      emitChange();
    });

    return () => {
      subscription.data.subscription.unsubscribe();
    };
  },

  getSnapshot: () => {
    return supabaseStoreLastEvent;
  },

  getServerSnapshot: () => null,
};

export const useSupabaseLastAuthEvent = () =>
  React.useSyncExternalStore(
    supabaseStore.subscribe,
    supabaseStore.getSnapshot,
    supabaseStore.getServerSnapshot,
  );
