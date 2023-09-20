/*
  Warnings:

  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Group";

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "telegramChatId" TEXT NOT NULL,
    "googleTablePublicLink" TEXT NOT NULL,
    "googleTableContent" JSONB,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);
