/*
  Warnings:

  - The primary key for the `project_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `project_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "project_users" DROP CONSTRAINT "project_users_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "project_users_pkey" PRIMARY KEY ("project_id", "user_id");
