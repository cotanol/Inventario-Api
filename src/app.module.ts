import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CatalogoModule } from './catalogo/catalogo.module';
import { InventarioModule } from './inventario/inventario.module';
import { ClientesModule } from './clientes/clientes.module';
import { VendedoresModule } from './vendedores/vendedores.module';
import { ReportsModule } from './reports/reports.module';
import { PrinterModule } from './printer/printer.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PedidosModule } from './pedidos/pedidos.module';
import { ProveedoresModule } from './proveedores/proveedores.module';
import { ComprasModule } from './compras/compras.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/',
    }),

    AuthModule,
    CatalogoModule,
    InventarioModule,
    ClientesModule,
    VendedoresModule,
    ReportsModule,
    PrinterModule,
    PedidosModule,
    ProveedoresModule,
    ComprasModule,
    PrismaModule,
  ],
})
export class AppModule {}
