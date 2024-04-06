import { GraphQLError } from 'graphql';
import { rule, shield } from 'graphql-shield';

import { ALLOWED_DOMAINS } from '@/constants/server/ALLOWED-DOMAINS';
import { type TContextType } from '@/graphql/context';

const authenticated = rule()((parent, argsRaw, context: TContextType, info) => {
  if (context.user === null || typeof context.user.email !== 'string') {
    return false;
  }

  const domain = context.user.email.split('@').at(-1);

  if (typeof domain !== 'string') {
    return false;
  }

  if (ALLOWED_DOMAINS[domain] !== true) {
    return false;
  }

  return true;
});

export const permissions = shield(
  {
    Query: {
      '*': authenticated,
    },
  },
  {
    fallbackError: (error) => {
      if (error instanceof GraphQLError) {
        return error;
      }

      if (error instanceof Error) {
        return error;
      }

      if (error === null) {
        return new GraphQLError('Unauthorized');
      }

      throw error;
    },
  },
);
