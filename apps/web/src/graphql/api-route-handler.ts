// We can't migrate to /app for this specific endpoint.
// https://github.com/vercel/next.js/discussions/49524#discussioncomment-7793922

import * as crypto from 'node:crypto';

import { type NextApiRequest } from 'next';
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
    pino.error({ error });

    if (config.NODE_ENV === 'development') {
      return formattedError;
    }

    return {
      ...formattedError,
      message: 'Internal Server Error',
    };
  },
});

// https://github.com/vercel/next.js/discussions/48951
export const apiRouteHandler = startServerAndCreateNextHandler<
  NextApiRequest,
  TContextType
>(server, {
  context: async (req, res) => {
    const cookies = req.cookies;

    const cookie = cookies[config.NEXT_PUBLIC_SUPABASE_COOKIE_NAME];

    const logger = pino.child({
      'REQUEST ID': crypto.randomUUID(),
    });

    if (typeof cookie !== 'string') {
      return Promise.resolve({ req, res, logger, user: null });
    }

    const user = getUserFromCookie(cookie);

    return Promise.resolve({ req, res, logger, user });
  },
});
