export const HealthTypes = /* GraphQL */ `
  type Health {
    Ollama: String!
  }

  type Query {
    Health: Health!
  }

  type Mutation {
    Health(Ollama: Boolean): Health!
  }
`;
