-- -- Rollback
-- SET
--     search_path TO _rokn_test;

-- ALTER TABLE
--     "screenshot" DROP CONSTRAINT "screenshot_UserID_fkey";

-- ALTER TABLE
--     "user_preference" DROP CONSTRAINT "user_preference_UserID_fkey";

-- DROP FUNCTION IF EXISTS _rokn_test.update_user_confirmed_at CASCADE;

-- DROP FUNCTION IF EXISTS _rokn_test.sync_user CASCADE;

-- REVOKE
-- SELECT
-- ,
-- INSERT
-- ,
-- UPDATE
-- ,
--     DELETE ON _rokn_test.user
-- FROM
--     supabase_auth_admin;

-- DROP TABLE IF EXISTS _rokn_test.user CASCADE;

-- REVOKE USAGE ON SCHEMA _rokn_test
-- FROM
--     supabase_auth_admin;

-- ALTER TABLE
--     "screenshot" RENAME COLUMN "UserID" TO "Uploader";

-- ALTER TABLE
--     "user_preference" RENAME COLUMN "UserID" TO "User";

-- DROP INDEX "user_preference_UserID_key";

-- CREATE UNIQUE INDEX "user_preference_User_key" ON "user_preference"("User");

-- DELETE FROM
--     "_rokn_test"."_prisma_migrations"
-- WHERE
--     migration_name LIKE '%add_user_table';

/*
  https://www.basedash.com/blog/how-to-rename-a-table-or-column-using-prisma-migrations

  Warnings:

  - You are about to drop the column `Uploader` on the `screenshot` table. All the data in the column will be lost.
    - Updated to a rename instead
  - You are about to drop the column `User` on the `user_preference` table. All the data in the column will be lost.
    - Updated to a rename instead
  - A unique constraint covering the columns `[UserID]` on the table `user_preference` will be added. If there are existing duplicate values, this will fail.
    - This is a renamed column which already had a unique constraint so it won't have duplicates
  - Added the required column `UserID` to the `screenshot` table without a default value. This is not possible if the table is not empty.
    - This is a renamed column which is not nullable so it'a assured to have a value.
  - Added the required column `UserID` to the `user_preference` table without a default value. This is not possible if the table is not empty.
    - This is a renamed column which is not nullable so it'a assured to have a value.
*/
-- DropIndex
DROP INDEX "user_preference_User_key";

-- AlterTable
ALTER TABLE "screenshot" RENAME COLUMN "Uploader" TO "UserID";

-- AlterTable
ALTER TABLE "user_preference" RENAME COLUMN "User" TO "UserID";

-- CreateTable
CREATE TABLE "user" (
    "instance_id" UUID,
    "id" UUID NOT NULL,
    "aud" VARCHAR(255),
    "role" VARCHAR(255),
    "email" VARCHAR(255),
    "encrypted_password" VARCHAR(255),
    "email_confirmed_at" TIMESTAMPTZ(6),
    "invited_at" TIMESTAMPTZ(6),
    "confirmation_token" VARCHAR(255),
    "confirmation_sent_at" TIMESTAMPTZ(6),
    "recovery_token" VARCHAR(255),
    "recovery_sent_at" TIMESTAMPTZ(6),
    "email_change_token_new" VARCHAR(255),
    "email_change" VARCHAR(255),
    "email_change_sent_at" TIMESTAMPTZ(6),
    "last_sign_in_at" TIMESTAMPTZ(6),
    "raw_app_meta_data" JSONB,
    "raw_user_meta_data" JSONB,
    "is_super_admin" BOOLEAN,
    "created_at" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6),
    "phone" TEXT,
    "phone_confirmed_at" TIMESTAMPTZ(6),
    "phone_change" TEXT DEFAULT '',
    "phone_change_token" VARCHAR(255) DEFAULT '',
    "phone_change_sent_at" TIMESTAMPTZ(6),
    "confirmed_at" TIMESTAMPTZ(6),
    "email_change_token_current" VARCHAR(255) DEFAULT '',
    "email_change_confirm_status" SMALLINT DEFAULT 0,
    "banned_until" TIMESTAMPTZ(6),
    "reauthentication_token" VARCHAR(255) DEFAULT '',
    "reauthentication_sent_at" TIMESTAMPTZ(6),
    "is_sso_user" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMPTZ(6),
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

--Mimic the behavior in the original auth.users table by making sure that the
--confirmed_at column is automatically populated
CREATE OR REPLACE FUNCTION update_user_confirmed_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.confirmed_at := LEAST(NEW.email_confirmed_at, NEW.phone_confirmed_at);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
	current_schema_name TEXT;
BEGIN
  SELECT
    current_schema() INTO current_schema_name;
  EXECUTE format('
    CREATE OR REPLACE TRIGGER %I_update_confirmed_at
    BEFORE INSERT OR UPDATE OF email_confirmed_at, phone_confirmed_at
    ON %I.user
    FOR EACH ROW
    EXECUTE FUNCTION %I.update_user_confirmed_at();
  ', current_schema_name, current_schema_name, current_schema_name);
END;
$$;

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- CreateIndex
CREATE INDEX "user_instance_id_idx" ON "user"("instance_id");

-- CreateIndex
CREATE INDEX "user_is_anonymous_idx" ON "user"("is_anonymous");

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_UserID_key" ON "user_preference"("UserID");

-- Sync the existing at this point so that when FKs are created, they don't
-- break
DO $$
DECLARE
	current_schema_name TEXT;
BEGIN
  -- Only sync data in the postgres database, where auth.users actually exists
  -- https://github.com/prisma/prisma/issues/18214#issuecomment-1747538985
  IF current_database() = 'postgres' THEN
    -- Get the current schema
    SELECT
      current_schema() INTO current_schema_name;
    EXECUTE format('
      INSERT INTO %I.user (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous)
      SELECT instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous FROM auth.users;
    ', current_schema_name);
  END IF;
END;
$$;

-- AddForeignKey
ALTER TABLE "screenshot" ADD CONSTRAINT "screenshot_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preference" ADD CONSTRAINT "user_preference_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
Additional custom changes to the migration
*/
-- Add permissions for the supabase_auth_admin role to manipulate the user table so that the sync function works.
DO $$
DECLARE
	current_schema_name TEXT;
BEGIN
  SELECT
    current_schema() INTO current_schema_name;

  EXECUTE format('GRANT USAGE ON SCHEMA %I TO supabase_auth_admin;', current_schema_name);
  
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON %I.user TO supabase_auth_admin;', current_schema_name);
END;
$$;

-- A helper to check if the user has the required privileges
-- SELECT has_schema_privilege('supabase_auth_admin', '_rokn_test', 'USAGE');

-- A helper to get a comma separated list of columns of auth for use in the below statements
-- SELECT string_agg(column_name, ', ' ORDER BY ordinal_position) AS column_list
-- FROM information_schema.columns
-- WHERE table_schema = 'auth'
--   AND table_name = 'users'
--   AND (is_generated = 'NEVER' OR is_generated IS NULL);

-- Create the function that will sync changes from auth.user to the user table
DO $$
DECLARE
    current_schema_name TEXT;
BEGIN
  -- Get the current schema
  SELECT
      current_schema() INTO current_schema_name;
  -- Handle all operations
  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION %I.sync_user()
    RETURNS TRIGGER AS $body$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        INSERT INTO %I.user (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, is_sso_user, deleted_at, is_anonymous)
        VALUES (NEW.instance_id, NEW.id, NEW.aud, NEW.role, NEW.email, NEW.encrypted_password, NEW.email_confirmed_at, NEW.invited_at, NEW.confirmation_token, NEW.confirmation_sent_at, NEW.recovery_token, NEW.recovery_sent_at, NEW.email_change_token_new, NEW.email_change, NEW.email_change_sent_at, NEW.last_sign_in_at, NEW.raw_app_meta_data, NEW.raw_user_meta_data, NEW.is_super_admin, NEW.created_at, NEW.updated_at, NEW.phone, NEW.phone_confirmed_at, NEW.phone_change, NEW.phone_change_token, NEW.phone_change_sent_at, NEW.email_change_token_current, NEW.email_change_confirm_status, NEW.banned_until, NEW.reauthentication_token, NEW.reauthentication_sent_at, NEW.is_sso_user, NEW.deleted_at, NEW.is_anonymous);
      ELSIF TG_OP = 'UPDATE' THEN
        UPDATE %I.user
        SET instance_id = NEW.instance_id, id = NEW.id, aud = NEW.aud, role = NEW.role, email = NEW.email, encrypted_password = NEW.encrypted_password, email_confirmed_at = NEW.email_confirmed_at, invited_at = NEW.invited_at, confirmation_token = NEW.confirmation_token, confirmation_sent_at = NEW.confirmation_sent_at, recovery_token = NEW.recovery_token, recovery_sent_at = NEW.recovery_sent_at, email_change_token_new = NEW.email_change_token_new, email_change = NEW.email_change, email_change_sent_at = NEW.email_change_sent_at, last_sign_in_at = NEW.last_sign_in_at, raw_app_meta_data = NEW.raw_app_meta_data, raw_user_meta_data = NEW.raw_user_meta_data, is_super_admin = NEW.is_super_admin, created_at = NEW.created_at, updated_at = NEW.updated_at, phone = NEW.phone, phone_confirmed_at = NEW.phone_confirmed_at, phone_change = NEW.phone_change, phone_change_token = NEW.phone_change_token, phone_change_sent_at = NEW.phone_change_sent_at, email_change_token_current = NEW.email_change_token_current, email_change_confirm_status = NEW.email_change_confirm_status, banned_until = NEW.banned_until, reauthentication_token = NEW.reauthentication_token, reauthentication_sent_at = NEW.reauthentication_sent_at, is_sso_user = NEW.is_sso_user, deleted_at = NEW.deleted_at, is_anonymous = NEW.is_anonymous
        WHERE id = NEW.id;
      ELSIF TG_OP = 'DELETE' THEN
        DELETE FROM %I.user WHERE id = OLD.id;
      END IF;
      RETURN NULL;
    END;
    $body$ LANGUAGE plpgsql;
  $f$, current_schema_name, current_schema_name, current_schema_name, current_schema_name);
END;
$$ LANGUAGE plpgsql;

-- Create the triggers that will call the function whenever there are changes in the auth.users table
DO $$
DECLARE
	current_schema_name TEXT;
BEGIN
  -- Only create triggers in the postgres database, where auth.users actually exists
  -- https://github.com/prisma/prisma/issues/18214#issuecomment-1747538985
  IF current_database() = 'postgres' THEN
    -- Get the current schema
    SELECT
      current_schema() INTO current_schema_name;
    EXECUTE format('
      CREATE OR REPLACE TRIGGER %I_sync_user_insert
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION %I.sync_user();
    ', current_schema_name, current_schema_name);
    EXECUTE format('
      CREATE OR REPLACE TRIGGER %I_sync_user_update
      AFTER UPDATE ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION %I.sync_user();
    ', current_schema_name, current_schema_name);
    EXECUTE format('
      CREATE OR REPLACE TRIGGER %I_sync_user_delete
      AFTER DELETE ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION %I.sync_user();
    ', current_schema_name, current_schema_name);
  END IF;
END;
$$;
