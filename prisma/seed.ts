import 'dotenv/config';

import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

import { initialData } from './seed-data';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no esta configurado para ejecutar el seed.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function clearAuthData() {
  await prisma.usuario.deleteMany();
  await prisma.rol.deleteMany();
}

async function seedRoles() {
  await prisma.rol.createMany({
    data: initialData.roles,
  });
}

async function seedUsers() {
  const roles = await prisma.rol.findMany({
    select: { rolId: true, nombre: true },
  });

  const roleMap = new Map(roles.map((rol) => [rol.nombre, rol.rolId]));

  for (const user of initialData.usuarios) {
    const rolId = roleMap.get(user.rol);

    if (!rolId) {
      throw new Error(`No existe el rol '${user.rol}' para el seed de usuarios.`);
    }

    const hashedPassword = await bcrypt.hash(user.clave, 10);

    await prisma.usuario.create({
      data: {
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.correoElectronico.toLowerCase().trim(),
        password: hashedPassword,
        rolId,
      },
    });
  }
}

async function main() {
  console.log('Iniciando seed con Prisma (roles simplificados)...');

  await clearAuthData();
  await seedRoles();
  await seedUsers();

  console.log('SEED EXECUTED');
}

main()
  .catch((error) => {
    console.error('Error ejecutando seed con Prisma');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
