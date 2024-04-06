import { PrismaClient, type Prisma } from '@prisma/client';
import type * as runtime from '@prisma/client/runtime/library';

export const PrismaPackage = <
  // https://github.com/prisma/prisma/blob/c8165cb34a0d663f3be74a19470fd0f319585048/packages/client/src/generation/TSClient/PrismaClient.ts#L356
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T
    ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition>
      ? Prisma.GetEvents<T['log']>
      : never
    : never,
  ExtArgs extends
    runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs,
>(
  // https://github.com/prisma/prisma/blob/c8165cb34a0d663f3be74a19470fd0f319585048/packages/client/src/generation/TSClient/PrismaClient.ts#L365
  config?: Prisma.Subset<T, Prisma.PrismaClientOptions>,
) => {
  return new PrismaClient<T, U, ExtArgs>(config);
};
