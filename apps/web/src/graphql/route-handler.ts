import { cookies } from 'next/headers';
import { type NextRequest } from 'next/server';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { applyMiddleware } from 'graphql-middleware';

import { pino } from '@/lib/server/pino';

import { config } from '@/config/server';
import { type TContextType } from '@/graphql/context';
import { permissions } from '@/graphql/permissions';
import { resolvers } from '@/graphql/resolvers';
import { typeDefs } from '@/graphql/typedefs';
import { getUserFromCookie } from '@/utilities/server/get-user-from-cookie';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

const schemaWithMiddleware = applyMiddleware(schema, permissions);

const server = new ApolloServer<TContextType>({
  schema: schemaWithMiddleware,
  includeStacktraceInErrorResponses: config.NODE_ENV === 'development',
  formatError: (formattedError, error) => {
    if (
      (error instanceof Error && error.message === 'Unauthorized') ||
      config.NODE_ENV === 'development'
    ) {
      return formattedError;
    }

    pino.error({ formattedError, error });

    return {
      ...formattedError,
      message: 'Internal Server Error',
    };
  },
});

export const routeHandler = startServerAndCreateNextHandler<
  NextRequest,
  TContextType
>(server, {
  context: async (req) => {
    const cookieStore = cookies();

    const cookie = cookieStore.get(config.NEXT_PUBLIC_SUPABASE_COOKIE_NAME);

    const logger = pino.child({
      'REQUEST ID': crypto.randomUUID(),
    });

    if (typeof cookie === 'undefined') {
      return Promise.resolve({ req, logger, user: null });
    }

    const user = getUserFromCookie(cookie.value);

    return Promise.resolve({ req, logger, user });
  },
});
