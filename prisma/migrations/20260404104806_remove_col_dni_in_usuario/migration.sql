/*
  Warnings:

  - You are about to drop the column `dni` on the `usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "usuario_dni_key";

-- AlterTable
ALTER TABLE "usuario" DROP COLUMN "dni";
