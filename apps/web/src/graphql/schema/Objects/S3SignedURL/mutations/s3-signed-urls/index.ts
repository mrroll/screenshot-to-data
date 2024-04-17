import {
  HeadObjectCommand,
  PutObjectCommand,
} from '@screenshot-to-data/common/dist/s3';
import { getSignedUrl } from '@screenshot-to-data/common/dist/s3-request-presigner';
import { Duration } from 'luxon';

import { s3 } from '@/lib/server/s3';

import { config } from '@/config/server';
import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { S3SignedURLsMutationArgsSchema } from '@/graphql/schema/Objects/S3SignedURL/mutations/s3-signed-urls/args';

export const S3SignedURLsMutation: MutationResolvers['S3SignedURLs'] = async (
  parent,
  argsRaw,
  context,
  info,
) => {
  const args = S3SignedURLsMutationArgsSchema.parse(argsRaw);

  const expiresIn = Duration.fromObject({ minutes: 5 }).as('seconds');

  const URLs = await Promise.all(
    args.S3SignedURLs.map(async ({ name }) => {
      const input:
        | ConstructorParameters<typeof PutObjectCommand>[0]
        | ConstructorParameters<typeof HeadObjectCommand>[0] = {
        Bucket: config.S3_BUCKET,
        Key: name,
      };

      const [URL, exists] = await Promise.allSettled([
        getSignedUrl(s3, new PutObjectCommand(input), {
          expiresIn,
        }),
        s3.send(new HeadObjectCommand(input)),
      ]);

      if (URL.status !== 'fulfilled') {
        throw new Error('URL.status is not fulfilled');
      }

      return {
        name,
        URL: URL.value,
        exists: exists.status === 'fulfilled',
      };
    }),
  );

  return URLs;
};
