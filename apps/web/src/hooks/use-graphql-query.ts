import {
  useQuery,
  type DefaultError,
  type QueryKey,
  type UseQueryOptions,
} from '@tanstack/react-query';
import { type RequestDocument } from 'graphql-request';

import { client } from '@/lib/client/graphql-request';

import { type ResultOf, type VariablesOf } from '@/graphql/graphql';

export const useGraphQLQuery = <
  TDocument extends RequestDocument,
  TQueryFnData = ResultOf<TDocument>,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = [TDocument, VariablesOf<TDocument>?],
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
    // All the inference starts from here.
    queryKey: [TDocument, VariablesOf<TDocument>?];
  },
) => {
  return useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryFn: ({ queryKey, signal }) => {
      const [document, variables] = queryKey;

      // Using the generic "Variables" does not seem to work because adding the below generic to the "useGraphQLQuery" function results in:
      // TVariables extends Variables = VariablesOf<TDocument>,
      // Type 'VariablesOf<TDocument>' does not satisfy the constraint 'Variables'.
      // Type 'unknown' is not assignable to type 'Variables'.ts(2344)
      // So we just typecast the args of the client.request function
      return client.request<TQueryFnData>({
        document,
        variables,
        signal,
      } as Parameters<typeof client.request>[0]);
    },
    ...options,
  });
};
