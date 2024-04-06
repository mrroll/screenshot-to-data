// This type is from Supabase which uses snake_case for column names.
export const HealthTypes = /* GraphQL */ `
  type Health {
    Ollama: String!
  }

  type Query {
    Health: Health!
  }
`;
