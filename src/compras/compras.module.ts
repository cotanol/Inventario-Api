import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComprasService } from './compras.service';
import { ComprasController } from './compras.controller';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Producto } from 'src/catalogo/entities/producto.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';
import { MovimientoInventario } from 'src/inventario/entities/movimiento-inventario.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Compra,
      DetalleCompra,
      Proveedor,
      Producto,
      Inventario,
      MovimientoInventario,
    ]),
    AuthModule,
    ReportsModule,
  ],
  controllers: [ComprasController],
  providers: [ComprasService],
  exports: [ComprasService],
})
export class ComprasModule {}
