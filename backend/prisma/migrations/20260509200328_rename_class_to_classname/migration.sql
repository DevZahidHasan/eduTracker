/*
  Warnings:

  - Added the required column `className` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassName" AS ENUM ('PLAY', 'NURSERY', 'KG', 'CLASS_1', 'CLASS_2', 'CLASS_3', 'CLASS_4', 'CLASS_5', 'CLASS_6', 'CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "className" "ClassName" NOT NULL DEFAULT 'CLASS_1';
ALTER TABLE "Student" ALTER COLUMN   "className" DROP DEFAULT;
