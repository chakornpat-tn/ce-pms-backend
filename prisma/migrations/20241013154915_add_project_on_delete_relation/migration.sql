-- DropForeignKey
ALTER TABLE "project_students" DROP CONSTRAINT "project_students_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project_users" DROP CONSTRAINT "project_users_project_id_fkey";

-- AddForeignKey
ALTER TABLE "project_students" ADD CONSTRAINT "project_students_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_users" ADD CONSTRAINT "project_users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
