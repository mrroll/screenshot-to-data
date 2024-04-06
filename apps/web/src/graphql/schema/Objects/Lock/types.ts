// This type is from Supabase which uses snake_case for column names.
export const LockTypes = /* GraphQL */ `
  input LockMutationInput {
    key: String
    owner: String
    ttl: SafeInt
    expirationTime: SafeInt
  }

  type Lock {
    key: String
    owner: String
    ttl: SafeInt
    expirationTime: SafeInt
  }

  type Mutation {
    Lock(options: LockMutationInput): Lock!
    DeleteLock(options: LockMutationInput): Void
  }
`;
