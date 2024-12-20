/*
  Warnings:

  - Made the column `project_document_id` on table `comments` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `user_project_role` to the `project_users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_project_document_id_fkey";

-- AlterTable
ALTER TABLE "comments" ALTER COLUMN "project_document_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "project_users" ADD COLUMN     "prep_docs" TEXT,
ADD COLUMN     "prep_point" TEXT,
ADD COLUMN     "project_docs" TEXT,
ADD COLUMN     "project_point" TEXT,
ADD COLUMN     "user_project_role" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "exam_date_time" TIMESTAMP(3),
ADD COLUMN     "exam_location" TEXT;

-- CreateTable
CREATE TABLE "progress_reports" (
    "id" SERIAL NOT NULL,
    "report" JSONB,
    "report_result" JSONB,
    "product_progress" INTEGER NOT NULL,
    "product_url" TEXT,
    "docs_progress" INTEGER NOT NULL,
    "docs_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" INTEGER NOT NULL,

    CONSTRAINT "progress_reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_project_document_id_fkey" FOREIGN KEY ("project_document_id") REFERENCES "project_documents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "progress_reports" ADD CONSTRAINT "progress_reports_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
