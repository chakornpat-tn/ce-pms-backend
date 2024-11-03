/*
  Warnings:

  - Made the column `project_document_id` on table `comments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_project_document_id_fkey";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "project_document_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "project_users" ADD COLUMN     "prep_docs" TEXT,
ADD COLUMN     "project_docs" TEXT,
ADD COLUMN     "user_project_role" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "exam_date_time" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_project_document_id_fkey" FOREIGN KEY ("project_document_id") REFERENCES "project_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
