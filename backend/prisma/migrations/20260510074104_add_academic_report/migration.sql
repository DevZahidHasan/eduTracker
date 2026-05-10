-- CreateTable
CREATE TABLE "AcademicReport" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "examType" TEXT NOT NULL,
    "gpa" DOUBLE PRECISION,
    "teacherRemarks" TEXT,
    "aiInsights" TEXT,
    "attendanceRate" DOUBLE PRECISION,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AcademicReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AcademicReport_studentId_examType_key" ON "AcademicReport"("studentId", "examType");

-- AddForeignKey
ALTER TABLE "AcademicReport" ADD CONSTRAINT "AcademicReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicReport" ADD CONSTRAINT "AcademicReport_examType_fkey" FOREIGN KEY ("examType") REFERENCES "ExamType"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
