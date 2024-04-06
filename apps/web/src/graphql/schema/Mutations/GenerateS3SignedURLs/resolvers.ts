import { type Resolvers } from '@/graphql/codegen/resolvers';
import { GenerateS3SignedURLsMutation } from '@/graphql/schema/Mutations/GenerateS3SignedURLs/mutation';

export const GenerateS3SignedURLsResolvers: Resolvers = {
  Mutation: {
    GenerateS3SignedURLs: GenerateS3SignedURLsMutation,
  },
};
