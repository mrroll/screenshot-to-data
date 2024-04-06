import { GraphQLError, type GraphQLScalarType } from 'graphql';
import { DateTimeISOResolver } from 'graphql-scalars';
import { DateTime } from 'luxon';

import { type Resolvers } from '@/graphql/codegen/resolvers';

const SafeDateTimeISOResolver = {
  ...DateTimeISOResolver,
  serialize: (v) => {
    try {
      return DateTimeISOResolver.serialize(v);
    } catch (error) {
      if (
        typeof v !== 'string' ||
        // We match the scenario by checking the following. If it's not this, something else is not working.
        error instanceof GraphQLError !== true ||
        error.message.at(-2) === 'z'
      ) {
        throw error;
      }
      return DateTime.fromISO(v).toUTC().toString();
    }
  },
} as GraphQLScalarType<Date, string>;

export const DateTimeISOResolvers: Resolvers = {
  // jsonObjectFrom serializes dates into JSON strings without the Z at the end so we need to do some extra parsing here.
  DateTimeISO: SafeDateTimeISOResolver,
};
