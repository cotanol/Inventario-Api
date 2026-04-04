import { Global, Logger, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PrismaService,
      useFactory: (configService: ConfigService) => {
        const logger = new Logger('PrismaModule');
        const connectionString = configService.get<string>('DATABASE_URL');
        const pool = new Pool({
          connectionString,
          max: 10, // Máximo de conexiones simultáneas
          idleTimeoutMillis: 30_000, // Cerrar conexiones inactivas después de 30s
          connectionTimeoutMillis: 5_000, // Timeout para obtener una conexión
          //TODO: Configurar SSL dependiendo el metodo elegido de despliegue
        });
        const adapter = new PrismaPg(pool);
        logger.log(`Pool PostgreSQL configurado (max: 10 conexiones)`);
        return new PrismaService(adapter);
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
