// This type is from Supabase which uses snake_case for column names.
export const UserTypes = /* GraphQL */ `
  type User {
    instance_id: String
    id: String!
    aud: String
    role: String
    email: String
    encrypted_password: String
    email_confirmed_at: DateTimeISO
    invited_at: DateTimeISO
    confirmation_token: String
    confirmation_sent_at: DateTimeISO
    recovery_token: String
    recovery_sent_at: DateTimeISO
    email_change_token_new: String
    email_change: String
    email_change_sent_at: DateTimeISO
    last_sign_in_at: DateTimeISO
    raw_app_meta_data: JSON
    raw_user_meta_data: JSON
    is_super_admin: Boolean
    created_at: DateTimeISO
    updated_at: DateTimeISO
    phone: String
    phone_confirmed_at: DateTimeISO
    phone_change: String
    phone_change_token: String
    phone_change_sent_at: DateTimeISO
    confirmed_at: DateTimeISO
    email_change_token_current: String
    email_change_confirm_status: Int
    banned_until: DateTimeISO
    reauthentication_token: String
    reauthentication_sent_at: DateTimeISO
    is_sso_user: Boolean
    deleted_at: DateTimeISO
    is_anonymous: Boolean

    user_preference: UserPreference
    screenshot: [Screenshot]
  }

  type UserPreference {
    CUID2: String!
    Prompt: String
    user: User
  }

  type Query {
    CurrentUser: User!
  }

  input UserPreferenceInput {
    Prompt: String
  }

  type CurrentUserMutationOutput {
    user_preference: UserPreference
  }

  type Mutation {
    CurrentUser(
      user_preference: UserPreferenceInput!
    ): CurrentUserMutationOutput!
  }
`;
