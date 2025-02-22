import { prisma } from '@/lib/server/prisma';

import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { getPrismaSelectFromInfo } from '@/graphql/helpers';
import { currentUserMutationArgsSchema } from '@/graphql/schema/Objects/User/mutations/current-user/args';

export const CurrentUserMutation: MutationResolvers['CurrentUser'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  if (
    typeof context.user?.email !== 'string' ||
    typeof context.user.sub !== 'string'
  ) {
    throw new Error('Unauthorized');
  }

  const { user_preference } = currentUserMutationArgsSchema.parse(argsRaw);

  if (typeof user_preference === 'undefined') {
    return { Preferences: null };
  }

  const Prompt = user_preference.Prompt === '' ? null : user_preference.Prompt;

  const prismaSelectFromInfo = getPrismaSelectFromInfo(info);

  const row = await prisma.user_preference.upsert({
    relationLoadStrategy: 'join',
    where: {
      UserID: context.user.sub,
    },
    create: {
      UserID: context.user.sub,
      Prompt,
    },
    update: {
      Prompt,
    },
    select:
      typeof prismaSelectFromInfo.user_preference === 'object' &&
      'select' in prismaSelectFromInfo.user_preference &&
      typeof prismaSelectFromInfo.user_preference.select === 'object'
        ? prismaSelectFromInfo.user_preference.select
        : undefined,
  });

  return {
    user_preference: row,
  };
};
