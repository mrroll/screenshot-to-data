-- AlterTable
ALTER TABLE "screenshot" ADD COLUMN     "Prompt" TEXT NOT NULL DEFAULT 'What is in this picture?',
ALTER COLUMN "UUID" SET DEFAULT (gen_random_uuid());

-- CreateTable
CREATE TABLE "user_preference" (
    "Id" SERIAL NOT NULL,
    "UUID" CHAR(36) NOT NULL DEFAULT (gen_random_uuid()),
    "CUID2" CHAR(40) NOT NULL DEFAULT '',
    "User" UUID NOT NULL,
    "Prompt" TEXT,

    CONSTRAINT "user_preference_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_UUID_key" ON "user_preference"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_CUID2_key" ON "user_preference"("CUID2");

-- CreateIndex
CREATE UNIQUE INDEX "user_preference_User_key" ON "user_preference"("User");
