import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

/**
 *
 * Uso: npm run db:seed
 */
async function bootstrap() {
  console.log(' Iniciando seed de la base de datos...\n');

  // Crear contexto de aplicación solo con el SeedModule
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn'],
  });

  const seedService = app.get(SeedService);

  try {
    const result = await seedService.runSeed();
    console.log(`\n ${result}`);
  } catch (error) {
    console.error('\n Error ejecutando seed:');
    console.error(error.message);
    if (error.response) {
      console.error('\nDetalles:', error.response);
    }
    process.exit(1);
  } finally {
    await app.close();
  }
}

bootstrap();
