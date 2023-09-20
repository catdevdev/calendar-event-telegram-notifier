/*
  Warnings:

  - Changed the type of `telegramChatId` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "telegramChatId",
ADD COLUMN     "telegramChatId" INTEGER NOT NULL;
