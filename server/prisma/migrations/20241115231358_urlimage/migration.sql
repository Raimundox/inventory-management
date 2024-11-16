/*
  Warnings:

  - You are about to drop the column `rating` on the `Products` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `Products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageProductUrl` to the `Products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Products" DROP COLUMN "rating",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "imageProductUrl" TEXT NOT NULL;
