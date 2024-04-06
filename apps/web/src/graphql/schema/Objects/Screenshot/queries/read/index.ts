import { GetObjectCommand } from '@screenshot-to-data/common/dist/s3';
import { getSignedUrl } from '@screenshot-to-data/common/dist/s3-request-presigner';
import { DateTime, Duration } from 'luxon';
import { z } from 'zod';

import { prisma } from '@/lib/server/prisma';
import { s3 } from '@/lib/server/s3';

import { config } from '@/config/server';
import { type QueryResolvers } from '@/graphql/codegen/resolvers';
import { getPrismaSelectFromInfo } from '@/graphql/helpers';
import { screenshotQueryArgsSchema } from '@/graphql/schema/Objects/Screenshot/queries/read/args';

const cacheSignedURLOptionsSchema = z.object({
  Key: z.string(),
  CUID2: z.string(),
});

const cacheSignedURL = async (
  options: z.infer<typeof cacheSignedURLOptionsSchema>,
) => {
  const args = cacheSignedURLOptionsSchema.parse(options);

  const signedURL = await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: config.S3_BUCKET,
      Key: args.Key,
    }),
    { expiresIn: Duration.fromObject({ days: 1 }).as('seconds') },
  );

  await prisma.screenshot.update({
    relationLoadStrategy: 'join',
    where: {
      CUID2: args.CUID2,
    },
    data: {
      S3URL: signedURL,
    },
  });

  return signedURL;
};

export const ScreenshotQuery: QueryResolvers['Screenshot'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const args = screenshotQueryArgsSchema.parse(argsRaw);

  const prismaSelectFromInfo = getPrismaSelectFromInfo(info);

  const screenshot = await prisma.screenshot.findFirst({
    where: {
      CUID2: args.CUID2,
    },

    select: {
      CUID2: true,
      S3URL: true,
      S3Filename: true,
      ...prismaSelectFromInfo,
    },
  });

  if (screenshot === null) {
    throw new Error('Not Found');
  }

  if (screenshot.S3URL === null) {
    const signedURL = await cacheSignedURL({
      Key: screenshot.S3Filename,
      CUID2: args.CUID2,
    });

    screenshot.S3URL = signedURL;
  } else {
    const S3URLSearchParams = Object.fromEntries(
      new URL(screenshot.S3URL).searchParams.entries(),
    );

    const params = z
      .object({
        'X-Amz-Date': z.string().transform((value) => DateTime.fromISO(value)),
        'X-Amz-Expires': z.coerce.number(),
      })
      .parse(S3URLSearchParams);

    const expiration = params['X-Amz-Date'].plus(
      Duration.fromObject({ seconds: params['X-Amz-Expires'] }),
    );

    if (DateTime.now().toMillis() >= expiration.toMillis()) {
      const signedURL = await cacheSignedURL({
        Key: screenshot.S3Filename,
        CUID2: args.CUID2,
      });

      screenshot.S3URL = signedURL;
    }
  }

  return screenshot;
};
