import {
  useInfiniteQuery,
  type DefaultError,
  type InfiniteData,
  type UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { deepmerge } from 'deepmerge-ts';
import { type RequestDocument } from 'graphql-request';
import { isEmpty } from 'remeda';
import { z } from 'zod';

import { client } from '@/lib/client/graphql-request';

import { type ResultOf, type VariablesOf } from '@/graphql/graphql';

export const useInfiniteGraphQLQuery = <
  TDocument extends RequestDocument,
  TQueryFnData = ResultOf<TDocument>,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
>(
  options: UseInfiniteQueryOptions<TQueryFnData, TError, TData> & {
    // All the inference starts from here.
    queryKey: [TDocument, VariablesOf<TDocument>?];
  },
) => {
  return useInfiniteQuery<TQueryFnData, TError, TData>({
    queryFn: ({ queryKey, pageParam, direction, meta, signal }) => {
      const [document, variables] = queryKey;

      const forward = z
        .object({
          first: z.number().positive(),
          after: z.string().optional(),
        })
        .safeParse(pageParam);

      const backward = z
        .object({
          last: z.number().positive(),
          before: z.string().optional(),
        })
        .safeParse(pageParam);

      const mergedVariables = deepmerge(
        typeof variables === 'object' ? variables : {},
        forward.success ? forward.data : {},
        backward.success ? backward.data : {},
      );

      return client.request<TQueryFnData>({
        document,
        variables: isEmpty(mergedVariables) ? undefined : mergedVariables,
        signal,
      } as Parameters<typeof client.request>[0]);
    },
    ...options,
  });
};
