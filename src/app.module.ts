import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      // __dirname está en dist/ cuando se compila
      // Subimos 1 nivel: dist/ -> backend/
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,

        // Usaremos migraciones en lugar de sync
        synchronize: false,

        // Docker PostgreSQL settings local in vps
        ssl: false,

        // Logging para debug (desactivar en producción)
        logging: configService.get<string>('STAGE') === 'dev',

        // Pool de conexiones
        extra: {
          max: 5, // Máximo de conexiones en el pool
          connectionTimeoutMillis: 5000,
        },
      }),
    }),

    AuthModule,

    SeedModule,

    CatalogoModule,

    InventarioModule,

    ClientesModule,

    VendedoresModule,

    ReportsModule,

    PrinterModule,

    PedidosModule,

    ProveedoresModule,

    ComprasModule,
  ],
})
export class AppModule {}
