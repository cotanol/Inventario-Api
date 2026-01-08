import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('inventario-reportes');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Inventario')
    .setDescription('Endpoints del sistema de inventario')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('inventario-reportes/docs', app, documentFactory);

  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  });

  await app.listen(process.env.PORT ?? 6040);
}
bootstrap();
