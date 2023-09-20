/*
  Warnings:

  - The primary key for the `Schedule` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Schedule` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[telegramChatId]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP CONSTRAINT "Schedule_pkey",
DROP COLUMN "id";

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_telegramChatId_key" ON "Schedule"("telegramChatId");
