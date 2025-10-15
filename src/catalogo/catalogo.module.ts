import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatalogoService } from './catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { Linea } from './entities/linea.entity';
import { Grupo } from './entities/grupo.entity';
import { Marca } from './entities/marca.entity';
import { Producto } from './entities/producto.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Linea, Grupo, Marca, Producto, Inventario]),
  ],
  controllers: [CatalogoController],
  providers: [CatalogoService],
})
export class CatalogoModule {}
