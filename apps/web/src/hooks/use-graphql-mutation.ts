import {
  useMutation,
  type DefaultError,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { type RequestDocument } from 'graphql-request';

import { mutationClient } from '@/lib/client/graphql-request';

import { type ResultOf, type VariablesOf } from '@/graphql/graphql';

export const useGraphQLMutation = <
  TDocument extends RequestDocument,
  TData = ResultOf<TDocument>,
  TError = DefaultError,
  TVariables = VariablesOf<TDocument>,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext> & {
    document: TDocument;
  },
) => {
  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: (variables) => {
      return mutationClient.request({
        document: options.document,
        variables,
      } as Parameters<(typeof mutationClient)['request']>[0]) as Promise<TData>;
    },
    ...options,
  });
};
