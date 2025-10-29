import { Module } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { InventarioController } from './inventario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventario } from './entities/inventario.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventario, MovimientoInventario]),
    AuthModule,
  ],
  controllers: [InventarioController],
  providers: [InventarioService],
  exports: [TypeOrmModule, InventarioService],
})
export class InventarioModule {}
