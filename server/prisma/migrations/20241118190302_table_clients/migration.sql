/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sales" DROP CONSTRAINT "Sales_userId_fkey";

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "Clients" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "Sales" ADD CONSTRAINT "Sales_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Clients"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
