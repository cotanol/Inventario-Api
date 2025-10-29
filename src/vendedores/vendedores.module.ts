import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendedoresService } from './vendedores.service';
import { VendedoresController } from './vendedores.controller';
import { Vendedor } from './entities/vendedor.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vendedor]), AuthModule],
  controllers: [VendedoresController],
  providers: [VendedoresService],
  exports: [TypeOrmModule],
})
export class VendedoresModule {}
