-- AlterTable
ALTER TABLE "AvailableActions" ADD COLUMN     "fields" JSONB NOT NULL DEFAULT '[]';

-- AlterTable
ALTER TABLE "AvailableTriggers" ADD COLUMN     "fields" JSONB NOT NULL DEFAULT '[]';
