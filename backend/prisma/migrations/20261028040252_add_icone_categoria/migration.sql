/*
  Warnings:

  - The primary key for the `Compra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Compra` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Pagamento` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Pagamento` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `compraId` on the `ItemCompra` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `compraId` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "ItemCompra" DROP CONSTRAINT "ItemCompra_compraId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_clienteId_fkey";

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "icone" TEXT;

-- AlterTable
ALTER TABLE "Compra" DROP CONSTRAINT "Compra_pkey",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pendente',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "valorManual" DECIMAL(10,2) NOT NULL DEFAULT 0,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "clienteId" DROP NOT NULL,
ADD CONSTRAINT "Compra_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ItemCompra" DROP COLUMN "compraId",
ADD COLUMN     "compraId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_pkey",
ADD COLUMN     "compraId" INTEGER NOT NULL,
ADD COLUMN     "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "clienteId" DROP NOT NULL,
ADD CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Compra" ADD CONSTRAINT "Compra_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemCompra" ADD CONSTRAINT "ItemCompra_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_compraId_fkey" FOREIGN KEY ("compraId") REFERENCES "Compra"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
