import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ssl: configService.get<string>('STAGE') === 'prod',
        extra: {
          ssl:
            configService.get<string>('STAGE') === 'prod'
              ? {
                  /* Opciones de SSL para producción */
                }
              : null,
        },
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        database: configService.get<string>('DB_NAME'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        autoLoadEntities: true,

        // --- ¡ESTE ES EL CAMBIO CLAVE! ---
        // Sincroniza automáticamente solo si no estamos en producción.
        synchronize: configService.get<string>('STAGE') !== 'prod',
        // dropSchema: true,
      }),
    }),

    AuthModule,

    SeedModule,
  ],
})
export class AppModule {}
