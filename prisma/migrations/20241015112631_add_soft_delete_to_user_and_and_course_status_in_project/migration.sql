-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "course_status" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3);
