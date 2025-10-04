-- Fix missing default timestamps for organization and member tables
ALTER TABLE "organization" ALTER COLUMN "created_at" SET DEFAULT NOW();
ALTER TABLE "member" ALTER COLUMN "created_at" SET DEFAULT NOW();

