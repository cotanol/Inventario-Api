import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidosService } from './pedidos.service';
import { PedidosController } from './pedidos.controller';
import { Pedido, DetallePedido } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pedido, DetallePedido]), AuthModule],
  controllers: [PedidosController],
  providers: [PedidosService],
  exports: [TypeOrmModule, PedidosService],
})
export class PedidosModule {}
