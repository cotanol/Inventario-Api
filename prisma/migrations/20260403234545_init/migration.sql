-- CreateEnum
CREATE TYPE "TipoPermiso" AS ENUM ('MENU', 'ACCION');

-- CreateEnum
CREATE TYPE "TipoMovimientoInventario" AS ENUM ('ENTRADA', 'SALIDA');

-- CreateEnum
CREATE TYPE "OrigenMovimiento" AS ENUM ('PEDIDO', 'COMPRA', 'AJUSTE');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('PENDIENTE', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoPago" AS ENUM ('CONTADO', 'CREDITO');

-- CreateEnum
CREATE TYPE "EstadoCompra" AS ENUM ('BORRADOR', 'ORDENADO', 'EN_TRANSITO', 'COMPLETADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "usuario" (
    "usuario_id" SERIAL NOT NULL,
    "dni" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("usuario_id")
);

-- CreateTable
CREATE TABLE "perfil" (
    "perfil_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "perfil_pkey" PRIMARY KEY ("perfil_id")
);

-- CreateTable
CREATE TABLE "permiso" (
    "permiso_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "tipo" "TipoPermiso" NOT NULL,
    "ruta" VARCHAR(255),
    "icono" VARCHAR(100),
    "orden" INTEGER NOT NULL DEFAULT 0,
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "permiso_padre_id" INTEGER,

    CONSTRAINT "permiso_pkey" PRIMARY KEY ("permiso_id")
);

-- CreateTable
CREATE TABLE "permiso_perfil" (
    "permiso_id" INTEGER NOT NULL,
    "perfil_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "permiso_perfil_pkey" PRIMARY KEY ("permiso_id","perfil_id")
);

-- CreateTable
CREATE TABLE "usuario_perfil" (
    "usuario_id" INTEGER NOT NULL,
    "perfil_id" INTEGER NOT NULL,

    CONSTRAINT "usuario_perfil_pkey" PRIMARY KEY ("usuario_id","perfil_id")
);

-- CreateTable
CREATE TABLE "linea" (
    "linea_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "linea_pkey" PRIMARY KEY ("linea_id")
);

-- CreateTable
CREATE TABLE "grupo" (
    "grupo_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "linea_id" INTEGER NOT NULL,

    CONSTRAINT "grupo_pkey" PRIMARY KEY ("grupo_id")
);

-- CreateTable
CREATE TABLE "marca" (
    "marca_id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marca_pkey" PRIMARY KEY ("marca_id")
);

-- CreateTable
CREATE TABLE "producto" (
    "producto_id" SERIAL NOT NULL,
    "codigo" VARCHAR(50),
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT,
    "precio_venta" DECIMAL(12,2) NOT NULL,
    "costo_unitario" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "unidad_medida" VARCHAR(50) NOT NULL DEFAULT 'UNIDAD',
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "grupo_id" INTEGER NOT NULL,
    "marca_id" INTEGER NOT NULL,

    CONSTRAINT "producto_pkey" PRIMARY KEY ("producto_id")
);

-- CreateTable
CREATE TABLE "inventario" (
    "inventario_id" SERIAL NOT NULL,
    "cantidad_actual" INTEGER NOT NULL DEFAULT 0,
    "cantidad_minima" INTEGER NOT NULL DEFAULT 0,
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "inventario_pkey" PRIMARY KEY ("inventario_id")
);

-- CreateTable
CREATE TABLE "movimiento_inventario" (
    "movimiento_id" SERIAL NOT NULL,
    "tipo" "TipoMovimientoInventario" NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "costo_unitario" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "documento_referencia_id" INTEGER,
    "origen_movimiento" "OrigenMovimiento" NOT NULL,
    "observacion" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "movimiento_inventario_pkey" PRIMARY KEY ("movimiento_id")
);

-- CreateTable
CREATE TABLE "vendedores" (
    "vendedor_id" SERIAL NOT NULL,
    "nombres" VARCHAR(50) NOT NULL,
    "apellido_paterno" VARCHAR(50) NOT NULL,
    "apellido_materno" VARCHAR(50),
    "dni" VARCHAR(8) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3),

    CONSTRAINT "vendedores_pkey" PRIMARY KEY ("vendedor_id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "cliente_id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "ruc" VARCHAR(11) NOT NULL,
    "direccion" VARCHAR(50) NOT NULL,
    "telefono" VARCHAR(50),
    "email" VARCHAR(100) NOT NULL,
    "clasificacion" VARCHAR(50) NOT NULL,
    "departamento" VARCHAR(50) NOT NULL,
    "provincia" VARCHAR(50) NOT NULL,
    "distrito" VARCHAR(50) NOT NULL,
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3),
    "vendedor_id" INTEGER NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("cliente_id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "proveedor_id" SERIAL NOT NULL,
    "nombre_empresa" VARCHAR(100) NOT NULL,
    "contacto_nombre" VARCHAR(100),
    "telefono" VARCHAR(20),
    "email" VARCHAR(100),
    "numero_identificacion_fiscal" VARCHAR(20) NOT NULL,
    "direccion" TEXT,
    "pais" VARCHAR(50) NOT NULL,
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMP(3),

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("proveedor_id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "pedido_id" SERIAL NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'PENDIENTE',
    "tipo_pago" "TipoPago" NOT NULL DEFAULT 'CONTADO',
    "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "igv" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "pdf_url" VARCHAR(255),
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "vendedor_id" INTEGER NOT NULL,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("pedido_id")
);

-- CreateTable
CREATE TABLE "detalle_pedido" (
    "detalle_id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "pedido_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "detalle_pedido_pkey" PRIMARY KEY ("detalle_id")
);

-- CreateTable
CREATE TABLE "compra" (
    "compra_id" SERIAL NOT NULL,
    "estado" "EstadoCompra" NOT NULL DEFAULT 'BORRADOR',
    "fecha_orden" TIMESTAMP(3),
    "fecha_entrega_estimada" TIMESTAMP(3),
    "total" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "observaciones" TEXT,
    "pdf_url" VARCHAR(255),
    "estado_registro" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,
    "proveedor_id" INTEGER NOT NULL,

    CONSTRAINT "compra_pkey" PRIMARY KEY ("compra_id")
);

-- CreateTable
CREATE TABLE "detalle_compra" (
    "detalle_id" SERIAL NOT NULL,
    "cantidad_solicitada" INTEGER NOT NULL,
    "cantidad_recibida" INTEGER NOT NULL DEFAULT 0,
    "costo_unitario" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "compra_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,

    CONSTRAINT "detalle_compra_pkey" PRIMARY KEY ("detalle_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_dni_key" ON "usuario"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "perfil_nombre_key" ON "perfil"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "linea_nombre_key" ON "linea"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "marca_nombre_key" ON "marca"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "producto_codigo_key" ON "producto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "inventario_producto_id_key" ON "inventario"("producto_id");

-- CreateIndex
CREATE INDEX "movimiento_inventario_documento_referencia_id_origen_movimi_idx" ON "movimiento_inventario"("documento_referencia_id", "origen_movimiento");

-- CreateIndex
CREATE UNIQUE INDEX "vendedores_dni_key" ON "vendedores"("dni");

-- CreateIndex
CREATE UNIQUE INDEX "vendedores_correo_key" ON "vendedores"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_ruc_key" ON "clientes"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "proveedores_numero_identificacion_fiscal_key" ON "proveedores"("numero_identificacion_fiscal");

-- AddForeignKey
ALTER TABLE "permiso" ADD CONSTRAINT "permiso_permiso_padre_id_fkey" FOREIGN KEY ("permiso_padre_id") REFERENCES "permiso"("permiso_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permiso_perfil" ADD CONSTRAINT "permiso_perfil_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permiso"("permiso_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permiso_perfil" ADD CONSTRAINT "permiso_perfil_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfil"("perfil_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_perfil" ADD CONSTRAINT "usuario_perfil_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_perfil" ADD CONSTRAINT "usuario_perfil_perfil_id_fkey" FOREIGN KEY ("perfil_id") REFERENCES "perfil"("perfil_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grupo" ADD CONSTRAINT "grupo_linea_id_fkey" FOREIGN KEY ("linea_id") REFERENCES "linea"("linea_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "grupo"("grupo_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto" ADD CONSTRAINT "producto_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marca"("marca_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario" ADD CONSTRAINT "inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimiento_inventario" ADD CONSTRAINT "movimiento_inventario_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("vendedor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("cliente_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_vendedor_id_fkey" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("vendedor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "detalle_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("pedido_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_pedido" ADD CONSTRAINT "detalle_pedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compra" ADD CONSTRAINT "compra_proveedor_id_fkey" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("proveedor_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compra" ADD CONSTRAINT "detalle_compra_compra_id_fkey" FOREIGN KEY ("compra_id") REFERENCES "compra"("compra_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_compra" ADD CONSTRAINT "detalle_compra_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "producto"("producto_id") ON DELETE RESTRICT ON UPDATE CASCADE;
