/*
  Warnings:

  - You are about to drop the column `subject` on the `project_statuses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_statuses" DROP COLUMN "subject",
ADD COLUMN     "course" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "is_submission_open" BOOLEAN NOT NULL DEFAULT false;
