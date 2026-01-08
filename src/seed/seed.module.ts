import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [SeedService],
  imports: [
    // Configuración necesaria para el contexto independiente
    ConfigModule.forRoot({
      isGlobal: true,
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
        autoLoadEntities: true, // Necesario para cargar entities de los módulos
        // Quitamos SSL porque la conexión es interna en Docker
        ssl: false,
      }),
    }),

    AuthModule,
  ],
})
export class SeedModule {}
