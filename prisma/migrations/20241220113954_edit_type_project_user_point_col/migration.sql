/*
  Warnings:

  - The `prep_point` column on the `project_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `project_point` column on the `project_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "project_users" DROP COLUMN "prep_point",
ADD COLUMN     "prep_point" INTEGER,
DROP COLUMN "project_point",
ADD COLUMN     "project_point" INTEGER;
