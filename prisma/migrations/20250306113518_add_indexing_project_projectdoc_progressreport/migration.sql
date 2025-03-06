-- CreateIndex
CREATE INDEX "progress_reports_status_idx" ON "progress_reports"("status");

-- CreateIndex
CREATE INDEX "progress_reports_created_at_idx" ON "progress_reports"("created_at");

-- CreateIndex
CREATE INDEX "project_documents_status_idx" ON "project_documents"("status");

-- CreateIndex
CREATE INDEX "projects_academic_year_semester_idx" ON "projects"("academic_year", "semester");

-- CreateIndex
CREATE INDEX "projects_project_academic_year_project_semester_idx" ON "projects"("project_academic_year", "project_semester");

-- CreateIndex
CREATE INDEX "projects_project_status_id_idx" ON "projects"("project_status_id");
