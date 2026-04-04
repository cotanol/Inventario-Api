/*
  Warnings:

  - You are about to drop the `perfil` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permiso` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permiso_perfil` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario_perfil` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rol_id` to the `usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PermisoModulo" AS ENUM ('USUARIOS', 'PRODUCTOS', 'CLIENTES', 'MARCAS', 'LINEAS', 'GRUPOS', 'ROLES', 'VENDEDORES', 'PROVEEDORES', 'COMPRAS', 'PEDIDOS');

-- DropForeignKey
ALTER TABLE "permiso" DROP CONSTRAINT "permiso_permiso_padre_id_fkey";

-- DropForeignKey
ALTER TABLE "permiso_perfil" DROP CONSTRAINT "permiso_perfil_perfil_id_fkey";

-- DropForeignKey
ALTER TABLE "permiso_perfil" DROP CONSTRAINT "permiso_perfil_permiso_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario_perfil" DROP CONSTRAINT "usuario_perfil_perfil_id_fkey";

-- DropForeignKey
ALTER TABLE "usuario_perfil" DROP CONSTRAINT "usuario_perfil_usuario_id_fkey";

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "rol_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "perfil";

-- DropTable
DROP TABLE "permiso";

-- DropTable
DROP TABLE "permiso_perfil";

-- DropTable
DROP TABLE "usuario_perfil";

-- DropEnum
DROP TYPE "TipoPermiso";

-- CreateTable
CREATE TABLE "rol" (
    "rol_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "permisos" "PermisoModulo"[],
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("rol_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "rol"("rol_id") ON DELETE RESTRICT ON UPDATE CASCADE;
