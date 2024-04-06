import { graphql } from '@/graphql/graphql';

export const CurrentUserQuery = graphql(`
  query CurrentUserQuery {
    CurrentUser {
      email
      user_preference {
        Prompt
      }
    }
  }
`);
