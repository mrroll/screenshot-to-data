import { deepmerge } from 'deepmerge-ts';
import { GraphQLClient } from 'graphql-request';

import { getHost } from '@/utilities/client/get-host';

const fetchWithContentTypeHeader: typeof fetch = async (...args) => {
  const [info, init] = args;

  const overrides: Partial<typeof init> = {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  const initWithOverrides = deepmerge(init, overrides);

  return fetch(info, initWithOverrides);
};

const client = new GraphQLClient(`${getHost()}/api/graphql`, {
  fetch: fetchWithContentTypeHeader,
  method: 'GET',
});

export const mutationClient = new GraphQLClient(`${getHost()}/api/graphql`, {
  // It sometimes defaults to xhr for some reason.
  fetch,
});

type TGraphQLRequestErrors = {
  response:
    | {
        errors:
          | Array<{
              message?: string;
            }>
          | undefined;
      }
    | undefined;
};

export { client };
export type { TGraphQLRequestErrors };
