import { match, P } from 'ts-pattern';

import { prisma } from '@/lib/server/prisma';

import { type QueryResolvers } from '@/graphql/codegen/resolvers';
import { getPrismaSelectFromInfo } from '@/graphql/helpers';
import { screenshotsQueryArgsSchema } from '@/graphql/schema/Objects/Screenshot/queries/list/args';

export const ScreenshotsQuery: QueryResolvers['Screenshots'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const argsParsed = screenshotsQueryArgsSchema.parse(argsRaw);

  const args = argsParsed?.options;

  // TODO
  // Fix this at the zod level
  if (typeof args === 'undefined') {
    throw new Error('Bad Request');
  }

  const prismaSelectFromInfo = getPrismaSelectFromInfo(info);

  if (
    typeof args.orderBy !== 'string' ||
    typeof args.orderByDirection !== 'string'
  ) {
    throw new Error('Invalid orderBy');
  }

  const { take, skip, cursor } = match(args)
    .with({ first: P.number, after: P.string }, ({ first, after }) => {
      return { take: first, skip: 1, cursor: { CUID2: after } };
    })
    .with({ last: P.number, before: P.string }, ({ last, before }) => {
      return { take: last * -1, skip: 1, cursor: { CUID2: before } };
    })
    .otherwise(() => {
      return { take: 10, skip: undefined, cursor: undefined };
    });

  const screenshots = await prisma.screenshot.findMany({
    relationLoadStrategy: 'join',
    take,
    skip,
    cursor,
    orderBy: [
      {
        [args.orderBy]: args.orderByDirection,
      },
      // Use a guranteed-to-be-sortable field
      {
        Id: 'desc',
      },
    ],
    select: {
      ...prismaSelectFromInfo,
      CUID2: true,
    },
  });

  return screenshots;
};
