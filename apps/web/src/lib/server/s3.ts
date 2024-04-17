import { s3Package } from '@screenshot-to-data/common/dist/s3';

import { config } from '@/config/server';

declare global {
  // eslint-disable-next-line no-var -- from https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution
  var __s3: ReturnType<typeof s3Package> | undefined;
}

export const s3 =
  global.__s3 ??
  s3Package({
    region: config.S3_REGION,
    credentials: {
      accessKeyId: config.S3_ACCESS_KEY_ID,
      secretAccessKey: config.S3_SECRET_ACCESS_KEY,
    },
  });

if (config.NODE_ENV !== 'production') {
  global.__s3 = s3;
}
