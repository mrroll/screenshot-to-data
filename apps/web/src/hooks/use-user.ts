import { useQueryClient } from '@tanstack/react-query';
import retry from 'async-retry';
import { match, P } from 'ts-pattern';

import {
  client,
  type TGraphQLRequestErrors,
} from '@/lib/client/graphql-request';
import { createBrowserClient } from '@/lib/client/supabase';

import { ALLOWED_DOMAINS } from '@/constants/client/ALLOWED-DOMAINS';
import { graphql, type ResultOf } from '@/graphql/graphql';
import { useGraphQLQuery } from '@/hooks/use-graphql-query';
import { useSupabaseLastAuthEvent } from '@/hooks/use-supabase-last-auth-event';

export const AUTH_STATUSES = {
  LOADING: 'LOADING',
  SIGNED_OUT: 'SIGNED_OUT',
  AUTHORIZED: 'AUTHORIZED',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

Object.freeze(AUTH_STATUSES);

const unauthorized = (error: unknown) => {
  const typedError = error as TGraphQLRequestErrors | null;

  return (
    typedError?.response?.errors?.some((e) => e.message === 'Unauthorized') ===
    true
  );
};

const CurrentUserQuery = graphql(`
  query CurrentUserQuery {
    CurrentUser {
      email
    }
  }
`);

const queryKey: [typeof CurrentUserQuery] = [CurrentUserQuery];

export const useUser = () => {
  const queryClient = useQueryClient();

  const supabase = createBrowserClient();

  const query = useGraphQLQuery<
    typeof CurrentUserQuery,
    ResultOf<typeof CurrentUserQuery> | { CurrentUser: null }
  >({
    queryKey,
    queryFn: ({ queryKey, signal }) => {
      const [document] = queryKey;

      return retry(
        async (error, attempt) => {
          if (attempt === 2) {
            await supabase.auth.getSession();
          }

          return client.request({ document, signal });
        },
        { retries: 1 },
      ).catch((error) => {
        if (unauthorized(error)) {
          return {
            CurrentUser: null,
          };
        }

        throw error;
      });
    },
    retry: false,
  });

  const supabaseLastAuthEvent = useSupabaseLastAuthEvent();

  if (
    supabaseLastAuthEvent !== null &&
    ['SIGNED_IN', 'SIGNED_OUT'].includes(supabaseLastAuthEvent)
  ) {
    const data = queryClient.getQueryData<(typeof query)['data']>(queryKey);

    const needsRefresh = match({ supabaseLastAuthEvent, data })
      .with(
        {
          supabaseLastAuthEvent: 'SIGNED_IN',
          data: { CurrentUser: null },
        },
        {
          supabaseLastAuthEvent: 'SIGNED_IN',
          data: undefined,
        },
        {
          supabaseLastAuthEvent: 'SIGNED_OUT',
          data: P.when((data) => {
            if (typeof data === 'undefined') {
              return false;
            }

            return data.CurrentUser !== null;
          }),
        },
        () => true,
      )
      .otherwise(() => false);

    if (
      needsRefresh &&
      queryClient.getQueryState(queryKey)?.fetchStatus !== 'fetching'
    ) {
      void queryClient.resetQueries({ queryKey });
    }
  }

  const status = match({ status: query.status, data: query.data })
    .with({ status: 'pending' }, () => AUTH_STATUSES.LOADING)
    .with(
      { status: 'success', data: undefined },
      { status: 'success', data: { CurrentUser: null } },
      () => AUTH_STATUSES.SIGNED_OUT,
    )
    .with(
      { status: 'success', data: { CurrentUser: { email: P.string } } },
      ({
        data: {
          CurrentUser: { email },
        },
      }) => {
        const domain = email.split('@').at(-1);

        if (typeof domain !== 'string') {
          return AUTH_STATUSES.UNAUTHORIZED;
        }

        if (ALLOWED_DOMAINS[domain] !== true) {
          return AUTH_STATUSES.UNAUTHORIZED;
        }

        return AUTH_STATUSES.AUTHORIZED;
      },
    )
    .otherwise(() => AUTH_STATUSES.UNAUTHORIZED);

  return { query, status };
};
