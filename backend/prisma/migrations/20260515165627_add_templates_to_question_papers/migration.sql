-- AlterTable
ALTER TABLE "QuestionPaper" ADD COLUMN     "isTemplate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "templateId" TEXT,
ALTER COLUMN "examDate" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "QuestionPaper"("id") ON DELETE SET NULL ON UPDATE CASCADE;
