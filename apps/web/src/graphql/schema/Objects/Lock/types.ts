export const LockTypes = /* GraphQL */ `
  type Lock {
    key: String
    owner: String
    ttl: SafeInt
    expirationTime: SafeInt
  }

  type Mutation {
    Lock(key: String, ttl: SafeInt): Lock!
    LockRemove(
      key: String
      owner: String
      ttl: SafeInt
      expirationTime: SafeInt
    ): Void
  }
`;
