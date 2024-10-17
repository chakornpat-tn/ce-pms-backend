/*
  Warnings:

  - You are about to drop the column `is_submission_open` on the `project_statuses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_statuses" DROP COLUMN "is_submission_open";
