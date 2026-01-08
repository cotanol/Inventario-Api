import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchemaNew1767890949294 implements MigrationInterface {
    name = 'InitialSchemaNew1767890949294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "vendedores" ("vendedor_id" SERIAL NOT NULL, "nombres" character varying(50) NOT NULL, "apellido_paterno" character varying(50) NOT NULL, "apellido_materno" character varying(50), "dni" character varying(8) NOT NULL, "correo" character varying(100) NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_b4c5a2b3befa2ff694fea3b65e9" UNIQUE ("dni"), CONSTRAINT "UQ_e06baada98a8972461c539c5ac3" UNIQUE ("correo"), CONSTRAINT "PK_6d2dd3db185058a02194bd49b9d" PRIMARY KEY ("vendedor_id"))`);
        await queryRunner.query(`CREATE TABLE "clientes" ("cliente_id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "ruc" character varying(11) NOT NULL, "direccion" character varying(50) NOT NULL, "telefono" character varying(50), "email" character varying(100) NOT NULL, "clasificacion" character varying(50) NOT NULL, "departamento" character varying(50) NOT NULL, "provincia" character varying(50) NOT NULL, "distrito" character varying(50) NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "vendedor_id" integer NOT NULL, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_d8747b033a4210f1d835e776c58" UNIQUE ("ruc"), CONSTRAINT "UQ_3cd5652ab34ca1a0a2c7a255313" UNIQUE ("email"), CONSTRAINT "PK_817183e739daf8a367dbf5d618a" PRIMARY KEY ("cliente_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."pedidos_tipo_pago_enum" AS ENUM('CONTADO', 'CREDITO')`);
        await queryRunner.query(`CREATE TYPE "public"."pedidos_estado_pedido_enum" AS ENUM('PENDIENTE', 'COMPLETADO', 'CANCELADO')`);
        await queryRunner.query(`CREATE TABLE "pedidos" ("pedido_id" SERIAL NOT NULL, "cliente_id" integer NOT NULL, "vendedor_id" integer NOT NULL, "tipo_pago" "public"."pedidos_tipo_pago_enum" NOT NULL, "total_neto" numeric(10,2) NOT NULL DEFAULT '0', "total_final" numeric(10,2) NOT NULL DEFAULT '0', "url_pdf" character varying(255), "estado_pedido" "public"."pedidos_estado_pedido_enum" NOT NULL DEFAULT 'PENDIENTE', "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_ac35459bf41c5b30f74333d15d8" PRIMARY KEY ("pedido_id"))`);
        await queryRunner.query(`CREATE TABLE "lineas" ("linea_id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_e8b75892fb44407e6c93cc65df7" UNIQUE ("nombre"), CONSTRAINT "PK_6bc81696669bf21c32c0fb9cf9a" PRIMARY KEY ("linea_id"))`);
        await queryRunner.query(`CREATE TABLE "grupos" ("grupo_id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), "linea_id" integer, CONSTRAINT "PK_b63f08774336ade37f4baf55b61" PRIMARY KEY ("grupo_id"))`);
        await queryRunner.query(`CREATE TABLE "marcas" ("marca_id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_29f5713899c32a96a8900143c6f" UNIQUE ("nombre"), CONSTRAINT "PK_31d6b0a236f98d5bd8c40dd2ee0" PRIMARY KEY ("marca_id"))`);
        await queryRunner.query(`CREATE TABLE "inventarios" ("inventario_id" SERIAL NOT NULL, "cantidad_actual" integer NOT NULL, "cantidad_minima" integer NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), "producto_id" integer, CONSTRAINT "REL_eef98c8770d9b13a5700874d5b" UNIQUE ("producto_id"), CONSTRAINT "PK_587ba45f88934f0631b392503bf" PRIMARY KEY ("inventario_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."movimientos_inventario_tipo_movimiento_enum" AS ENUM('ENTRADA', 'SALIDA')`);
        await queryRunner.query(`CREATE TYPE "public"."movimientos_inventario_origen_movimiento_enum" AS ENUM('PEDIDO', 'COMPRA', 'AJUSTE')`);
        await queryRunner.query(`CREATE TABLE "movimientos_inventario" ("movimiento_inventario_id" SERIAL NOT NULL, "producto_id" integer NOT NULL, "tipo_movimiento" "public"."movimientos_inventario_tipo_movimiento_enum" NOT NULL, "cantidad" integer NOT NULL, "documento_referencia_id" integer NOT NULL, "origen_movimiento" "public"."movimientos_inventario_origen_movimiento_enum" NOT NULL, "costo_unitario" numeric(10,2) NOT NULL DEFAULT '0', "fecha_movimiento" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_be04110ba59576f6fb8317ee37d" PRIMARY KEY ("movimiento_inventario_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a613111a593603ed165e374ec1" ON "movimientos_inventario" ("documento_referencia_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_24453001bd5fcf4bbeae52278d" ON "movimientos_inventario" ("documento_referencia_id", "origen_movimiento") `);
        await queryRunner.query(`CREATE TABLE "productos" ("producto_id" SERIAL NOT NULL, "codigo" character varying(20), "nombre" character varying(100) NOT NULL, "descripcion" text, "precio_venta" numeric(10,2) NOT NULL, "costo_referencial" numeric(10,2), "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), "grupo_id" integer, "marca_id" integer, CONSTRAINT "UQ_2da210b34325c2319d784a32d49" UNIQUE ("codigo"), CONSTRAINT "PK_c2307fd0b4e64845bf5711413f4" PRIMARY KEY ("producto_id"))`);
        await queryRunner.query(`CREATE TABLE "detalles_pedido" ("detalle_id" SERIAL NOT NULL, "pedido_id" integer NOT NULL, "producto_id" integer NOT NULL, "cantidad" integer NOT NULL, "precio_unitario" numeric(10,2) NOT NULL, "subtotal_linea" numeric(10,2) NOT NULL, CONSTRAINT "PK_8c94e882ec259f9c1ff88360427" PRIMARY KEY ("detalle_id"))`);
        await queryRunner.query(`CREATE TABLE "detalles_compra" ("detalle_compra_id" SERIAL NOT NULL, "compra_id" integer NOT NULL, "producto_id" integer NOT NULL, "cantidad_solicitada" integer NOT NULL, "cantidad_recibida" integer NOT NULL DEFAULT '0', "costo_unitario" numeric(10,2) NOT NULL, "subtotal" numeric(10,2) NOT NULL, CONSTRAINT "PK_bf16180a11f944a7d7164137ec5" PRIMARY KEY ("detalle_compra_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."compras_estado_compra_enum" AS ENUM('BORRADOR', 'ORDENADO', 'EN_TRANSITO', 'COMPLETADO', 'CANCELADO')`);
        await queryRunner.query(`CREATE TABLE "compras" ("compra_id" SERIAL NOT NULL, "proveedor_id" integer NOT NULL, "fecha_orden" TIMESTAMP WITH TIME ZONE NOT NULL, "fecha_llegada_estimada" TIMESTAMP WITH TIME ZONE, "estado_compra" "public"."compras_estado_compra_enum" NOT NULL DEFAULT 'BORRADOR', "total_compra" numeric(10,2) NOT NULL DEFAULT '0', "url_pdf" character varying(255), "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_7ed3086490ed7367046a9198dc6" PRIMARY KEY ("compra_id"))`);
        await queryRunner.query(`CREATE TABLE "proveedores" ("proveedor_id" SERIAL NOT NULL, "nombre_empresa" character varying(100) NOT NULL, "contacto_nombre" character varying(100), "telefono" character varying(20), "email" character varying(100), "numero_identificacion_fiscal" character varying(20) NOT NULL, "direccion" text, "pais" character varying(50) NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_84564ddf970ae2072f9e1f60cb2" UNIQUE ("numero_identificacion_fiscal"), CONSTRAINT "PK_4baef0fe42f95e00a555585804d" PRIMARY KEY ("proveedor_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."permisos_tipo_permiso_enum" AS ENUM('MENU', 'ACCION')`);
        await queryRunner.query(`CREATE TABLE "permisos" ("permiso_id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "url_menu" character varying(50), "tipo_permiso" "public"."permisos_tipo_permiso_enum" NOT NULL DEFAULT 'MENU', "key_permiso" character varying(50) NOT NULL, "descripcion" character varying(100), "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), "permiso_padre_id" integer, CONSTRAINT "PK_803c761377ec2c03dff9ff01283" PRIMARY KEY ("permiso_id"))`);
        await queryRunner.query(`CREATE TABLE "permisos_perfiles" ("permiso_id" integer NOT NULL, "perfil_id" integer NOT NULL, "orden" smallint NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_4efb96c8eb316bc93b4cdc7c1af" PRIMARY KEY ("permiso_id", "perfil_id"))`);
        await queryRunner.query(`CREATE TABLE "perfiles" ("perfil_id" SERIAL NOT NULL, "nombre" character varying(50) NOT NULL, "descripcion" character varying(500), "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_c9eeec15beb1d8885c26c046335" PRIMARY KEY ("perfil_id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios" ("usuario_id" SERIAL NOT NULL, "dni" character varying(15) NOT NULL, "nombres" character varying(40) NOT NULL, "apellido_paterno" character varying(40) NOT NULL, "apellido_materno" character varying(40), "celular" character varying(15), "correo_electronico" character varying(40) NOT NULL, "clave" character varying(255) NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, "fecha_creacion" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "fecha_modificacion" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "UQ_e871b7157e4b74290df9baa9c93" UNIQUE ("correo_electronico"), CONSTRAINT "PK_14bb5fbbada99a453c18106d039" PRIMARY KEY ("usuario_id"))`);
        await queryRunner.query(`CREATE TABLE "usuarios_perfiles" ("usuario_id" integer NOT NULL, "perfil_id" integer NOT NULL, "estado_registro" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_0cc0bd3c77b454c49244a450425" PRIMARY KEY ("usuario_id", "perfil_id"))`);
        await queryRunner.query(`ALTER TABLE "clientes" ADD CONSTRAINT "FK_9334e451fc254cf7716f0ded3e8" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("vendedor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_2fc639de84f845569ac2c9f78aa" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("cliente_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_0db8bbade4d70d9b854cd21e8da" FOREIGN KEY ("vendedor_id") REFERENCES "vendedores"("vendedor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grupos" ADD CONSTRAINT "FK_35825cf62d433b2543b0dcdf15e" FOREIGN KEY ("linea_id") REFERENCES "lineas"("linea_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventarios" ADD CONSTRAINT "FK_eef98c8770d9b13a5700874d5b0" FOREIGN KEY ("producto_id") REFERENCES "productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" ADD CONSTRAINT "FK_34e722a39e30087fa624b5955d5" FOREIGN KEY ("producto_id") REFERENCES "productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos" ADD CONSTRAINT "FK_407c28044730ed558c785f826f1" FOREIGN KEY ("grupo_id") REFERENCES "grupos"("grupo_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productos" ADD CONSTRAINT "FK_db0c18bdd5f379d40ae838e74bd" FOREIGN KEY ("marca_id") REFERENCES "marcas"("marca_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalles_pedido" ADD CONSTRAINT "FK_33f037ea18df4a1155c99c5dd2a" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("pedido_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalles_pedido" ADD CONSTRAINT "FK_c8d7a993941a10f4978f9f8dd3f" FOREIGN KEY ("producto_id") REFERENCES "productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalles_compra" ADD CONSTRAINT "FK_adfe31e80383d22f04720a84843" FOREIGN KEY ("compra_id") REFERENCES "compras"("compra_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "detalles_compra" ADD CONSTRAINT "FK_bfb84a49a367b18803069b0b9b8" FOREIGN KEY ("producto_id") REFERENCES "productos"("producto_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "compras" ADD CONSTRAINT "FK_d7b3950fea313d15e46e0c59286" FOREIGN KEY ("proveedor_id") REFERENCES "proveedores"("proveedor_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permisos" ADD CONSTRAINT "FK_a1fb3650953aa85892d378882d3" FOREIGN KEY ("permiso_padre_id") REFERENCES "permisos"("permiso_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permisos_perfiles" ADD CONSTRAINT "FK_ee266676f999cc79933f24b93d3" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("permiso_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permisos_perfiles" ADD CONSTRAINT "FK_66195ef9a36f7dc50a65d00c0fc" FOREIGN KEY ("perfil_id") REFERENCES "perfiles"("perfil_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios_perfiles" ADD CONSTRAINT "FK_7cc9fa6eb6daa52fc2be7304c34" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("usuario_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "usuarios_perfiles" ADD CONSTRAINT "FK_19cf9605a9941fc474adc2de981" FOREIGN KEY ("perfil_id") REFERENCES "perfiles"("perfil_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios_perfiles" DROP CONSTRAINT "FK_19cf9605a9941fc474adc2de981"`);
        await queryRunner.query(`ALTER TABLE "usuarios_perfiles" DROP CONSTRAINT "FK_7cc9fa6eb6daa52fc2be7304c34"`);
        await queryRunner.query(`ALTER TABLE "permisos_perfiles" DROP CONSTRAINT "FK_66195ef9a36f7dc50a65d00c0fc"`);
        await queryRunner.query(`ALTER TABLE "permisos_perfiles" DROP CONSTRAINT "FK_ee266676f999cc79933f24b93d3"`);
        await queryRunner.query(`ALTER TABLE "permisos" DROP CONSTRAINT "FK_a1fb3650953aa85892d378882d3"`);
        await queryRunner.query(`ALTER TABLE "compras" DROP CONSTRAINT "FK_d7b3950fea313d15e46e0c59286"`);
        await queryRunner.query(`ALTER TABLE "detalles_compra" DROP CONSTRAINT "FK_bfb84a49a367b18803069b0b9b8"`);
        await queryRunner.query(`ALTER TABLE "detalles_compra" DROP CONSTRAINT "FK_adfe31e80383d22f04720a84843"`);
        await queryRunner.query(`ALTER TABLE "detalles_pedido" DROP CONSTRAINT "FK_c8d7a993941a10f4978f9f8dd3f"`);
        await queryRunner.query(`ALTER TABLE "detalles_pedido" DROP CONSTRAINT "FK_33f037ea18df4a1155c99c5dd2a"`);
        await queryRunner.query(`ALTER TABLE "productos" DROP CONSTRAINT "FK_db0c18bdd5f379d40ae838e74bd"`);
        await queryRunner.query(`ALTER TABLE "productos" DROP CONSTRAINT "FK_407c28044730ed558c785f826f1"`);
        await queryRunner.query(`ALTER TABLE "movimientos_inventario" DROP CONSTRAINT "FK_34e722a39e30087fa624b5955d5"`);
        await queryRunner.query(`ALTER TABLE "inventarios" DROP CONSTRAINT "FK_eef98c8770d9b13a5700874d5b0"`);
        await queryRunner.query(`ALTER TABLE "grupos" DROP CONSTRAINT "FK_35825cf62d433b2543b0dcdf15e"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_0db8bbade4d70d9b854cd21e8da"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_2fc639de84f845569ac2c9f78aa"`);
        await queryRunner.query(`ALTER TABLE "clientes" DROP CONSTRAINT "FK_9334e451fc254cf7716f0ded3e8"`);
        await queryRunner.query(`DROP TABLE "usuarios_perfiles"`);
        await queryRunner.query(`DROP TABLE "usuarios"`);
        await queryRunner.query(`DROP TABLE "perfiles"`);
        await queryRunner.query(`DROP TABLE "permisos_perfiles"`);
        await queryRunner.query(`DROP TABLE "permisos"`);
        await queryRunner.query(`DROP TYPE "public"."permisos_tipo_permiso_enum"`);
        await queryRunner.query(`DROP TABLE "proveedores"`);
        await queryRunner.query(`DROP TABLE "compras"`);
        await queryRunner.query(`DROP TYPE "public"."compras_estado_compra_enum"`);
        await queryRunner.query(`DROP TABLE "detalles_compra"`);
        await queryRunner.query(`DROP TABLE "detalles_pedido"`);
        await queryRunner.query(`DROP TABLE "productos"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24453001bd5fcf4bbeae52278d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a613111a593603ed165e374ec1"`);
        await queryRunner.query(`DROP TABLE "movimientos_inventario"`);
        await queryRunner.query(`DROP TYPE "public"."movimientos_inventario_origen_movimiento_enum"`);
        await queryRunner.query(`DROP TYPE "public"."movimientos_inventario_tipo_movimiento_enum"`);
        await queryRunner.query(`DROP TABLE "inventarios"`);
        await queryRunner.query(`DROP TABLE "marcas"`);
        await queryRunner.query(`DROP TABLE "grupos"`);
        await queryRunner.query(`DROP TABLE "lineas"`);
        await queryRunner.query(`DROP TABLE "pedidos"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_estado_pedido_enum"`);
        await queryRunner.query(`DROP TYPE "public"."pedidos_tipo_pago_enum"`);
        await queryRunner.query(`DROP TABLE "clientes"`);
        await queryRunner.query(`DROP TABLE "vendedores"`);
    }

}
