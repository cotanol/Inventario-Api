import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config(); // Carga las variables de entorno para la CLI

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Desactivamos SSL porque la conexión es interna en Docker
  ssl: false,

  // Apunta a entidades y migraciones compiladas en la carpeta /dist
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migration/*{.ts,.js}'],

  synchronize: false, // Siempre false aquí
});
