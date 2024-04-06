import { s3Package } from '@screenshot-to-data/common/dist/s3';

import { config } from '@/config/server';

export const s3 = s3Package({
  region: config.S3_REGION,
  credentials: {
    accessKeyId: config.S3_ACCESS_KEY_ID,
    secretAccessKey: config.S3_SECRET_ACCESS_KEY,
  },
});
