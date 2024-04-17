import { prisma } from '@/lib/server/prisma';

import { type QueryResolvers } from '@/graphql/codegen/resolvers';
import { getPrismaSelectFromInfo } from '@/graphql/helpers';

export const CurrentUserQuery: QueryResolvers['CurrentUser'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  if (typeof context.user?.email !== 'string') {
    throw new Error('Unauthorized');
  }

  const prismaSelectFromInfo = getPrismaSelectFromInfo(info);

  const row = await prisma.user.findFirstOrThrow({
    relationLoadStrategy: 'join',
    where: {
      id: context.user.sub,
    },
    select: { ...prismaSelectFromInfo, id: true },
  });

  return row;
};
