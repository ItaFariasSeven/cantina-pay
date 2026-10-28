/*
  Warnings:

  - You are about to drop the column `email` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `Cliente` table. All the data in the column will be lost.
  - Added the required column `nomeAluno` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomePai` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Cliente_email_key";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "email",
DROP COLUMN "nome",
DROP COLUMN "telefone",
ADD COLUMN     "nomeAluno" TEXT NOT NULL,
ADD COLUMN     "nomePai" TEXT NOT NULL;
