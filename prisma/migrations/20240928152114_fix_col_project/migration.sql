/*
  Warnings:

  - You are about to drop the column `abstractEnd` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `detailEnd` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "abstractEnd",
DROP COLUMN "detailEnd",
ADD COLUMN     "abstractEng" TEXT,
ADD COLUMN     "detailEng" TEXT;
