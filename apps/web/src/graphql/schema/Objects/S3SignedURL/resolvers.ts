import { type Resolvers } from '@/graphql/codegen/resolvers';
import { S3SignedURLsMutation } from '@/graphql/schema/Objects/S3SignedURL/mutations/s3-signed-urls';

export const S3SignedURLResolvers: Resolvers = {
  Mutation: {
    S3SignedURLs: S3SignedURLsMutation,
  },
};
