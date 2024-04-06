-- CreateTable
CREATE TABLE "screenshot" (
    "Id" SERIAL NOT NULL,
    "UUID" CHAR(36) NOT NULL DEFAULT (gen_random_uuid()),
    "CUID2" CHAR(35) NOT NULL DEFAULT '',
    "S3Filename" VARCHAR(1024) NOT NULL,
    "OriginalFilename" TEXT NOT NULL,
    "Uploader" UUID NOT NULL,
    "Description" TEXT NOT NULL,
    "S3URL" VARCHAR(2000),
    "Width" INTEGER NOT NULL,
    "Height" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screenshot_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "screenshot_UUID_key" ON "screenshot"("UUID");

-- CreateIndex
CREATE UNIQUE INDEX "screenshot_CUID2_key" ON "screenshot"("CUID2");

-- CreateIndex
CREATE UNIQUE INDEX "screenshot_S3Filename_key" ON "screenshot"("S3Filename");

-- CreateIndex
CREATE UNIQUE INDEX "screenshot_S3URL_key" ON "screenshot"("S3URL");

-- CreateIndex
CREATE INDEX "screenshot_CreatedAt_idx" ON "screenshot"("CreatedAt");

-- CreateIndex
CREATE INDEX "screenshot_UpdatedAt_idx" ON "screenshot"("UpdatedAt");
