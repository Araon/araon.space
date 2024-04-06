/*
  Warnings:

  - Added the required column `ip_identity` to the `Comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "ip_identity" INTEGER NOT NULL,
ADD COLUMN     "show_comments" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "postId" SET DATA TYPE TEXT;
