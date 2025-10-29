import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido, DetallePedido } from './entities';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Vendedor } from 'src/vendedores/entities/vendedor.entity';
import { Producto } from 'src/catalogo/entities/producto.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';
import { MovimientoInventario } from 'src/inventario/entities/movimiento-inventario.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ReportsModule } from 'src/reports/reports.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pedido,
      DetallePedido,
      Cliente,
      Vendedor,
      Producto,
      Inventario,
      MovimientoInventario,
    ]),
    AuthModule,
    ReportsModule,
  ],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [TypeOrmModule, PedidosService],
})
export class PedidosModule {}
