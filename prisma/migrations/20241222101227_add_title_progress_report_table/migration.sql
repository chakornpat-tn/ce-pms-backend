/*
  Warnings:

  - Added the required column `title` to the `progress_reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "progress_reports" ADD COLUMN     "title" TEXT NOT NULL;
