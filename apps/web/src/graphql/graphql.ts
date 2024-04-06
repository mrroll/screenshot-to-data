import { initGraphQLTada } from 'gql.tada';

import type { introspection } from '@/graphql/codegen/graphql-env';

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: {
    DateTimeISO: string;
    Void: null;
    SafeInt: number;
  };
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
