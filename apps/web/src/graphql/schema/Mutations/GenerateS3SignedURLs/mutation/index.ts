import {
  HeadObjectCommand,
  PutObjectCommand,
} from '@screenshot-to-data/common/dist/s3';
import { getSignedUrl } from '@screenshot-to-data/common/dist/s3-request-presigner';
import { Duration } from 'luxon';

import { s3 } from '@/lib/server/s3';

import { config } from '@/config/server';
import { type MutationResolvers } from '@/graphql/codegen/resolvers';
import { generateS3SignedURLsArgs } from '@/graphql/schema/Mutations/GenerateS3SignedURLs/mutation/args';

export const GenerateS3SignedURLsMutation: MutationResolvers['GenerateS3SignedURLs'] =
  async (parent, argsRaw, context, info) => {
    const args = generateS3SignedURLsArgs.parse(argsRaw);

    const expiresIn = Duration.fromObject({ minutes: 5 }).as('seconds');

    const URLs = await Promise.all(
      args.options.map(async ({ name }) => {
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
