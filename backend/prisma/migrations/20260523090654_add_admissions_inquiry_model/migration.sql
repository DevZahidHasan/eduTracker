-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'INTERESTED', 'NOT_INTERESTED', 'ADMITTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "InquirySource" AS ENUM ('WALK_IN', 'PHONE', 'WEBSITE', 'FACEBOOK', 'REFERENCE', 'OTHER');

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" SERIAL NOT NULL,
    "inquiryNumber" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "parentName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "interestedGrade" TEXT NOT NULL,
    "previousSchool" TEXT,
    "source" "InquirySource" NOT NULL DEFAULT 'OTHER',
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "nextFollowUp" TIMESTAMP(3),
    "assignedToId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inquiry_inquiryNumber_key" ON "Inquiry"("inquiryNumber");

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
