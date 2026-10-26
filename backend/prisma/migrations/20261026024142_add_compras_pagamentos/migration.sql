/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `icone` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `nomeAluno` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `nomePai` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `pago` on the `Compra` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Compra` table. All the data in the column will be lost.
  - You are about to drop the column `compraId` on the `Pagamento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clienteId` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_compraId_fkey";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "createdAt",
DROP COLUMN "icone",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "nomeAluno",
DROP COLUMN "nomePai",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "saldo" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "telefone" TEXT;

-- AlterTable
ALTER TABLE "Compra" DROP COLUMN "pago",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "compraId",
ADD COLUMN     "clienteId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "Cliente"("email");

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
