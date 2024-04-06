import { s3Package } from '@screenshot-to-data/common/dist/s3';

import { config } from '@/config';

export const workspaceS3 = s3Package({
  region: config.WORKSPACE_S3_REGION,
  credentials: {
    accessKeyId: config.WORKSPACE_S3_ACCESS_KEY_ID,
    secretAccessKey: config.WORKSPACE_S3_SECRET_ACCESS_KEY,
  },
});
