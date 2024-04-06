import { S3Client } from '@aws-sdk/client-s3';

export const s3Package = (
  ...config: ConstructorParameters<typeof S3Client>
) => {
  return new S3Client(...config);
};

export * from '@aws-sdk/client-s3';
