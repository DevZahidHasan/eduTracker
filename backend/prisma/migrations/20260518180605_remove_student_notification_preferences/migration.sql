/*
  Warnings:

  - You are about to drop the column `emailNotificationsEnabled` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappNotificationsEnabled` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "emailNotificationsEnabled",
DROP COLUMN "whatsappNotificationsEnabled";
