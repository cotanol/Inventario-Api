import 'dotenv/config';

import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, TipoPermiso } from '../generated/prisma/client';

import { initialData } from './seed-data';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no esta configurado para ejecutar el seed.');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const REQUIRED_TABLES = [
  'usuario',
  'perfil',
  'permiso',
  'usuario_perfil',
  'permiso_perfil',
] as const;

async function ensureRequiredTables() {
  const rows = await prisma.$queryRawUnsafe<Array<{ table_name: string }>>(
    `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `,
  );

  const existing = new Set(rows.map((row) => row.table_name));
  const missing = REQUIRED_TABLES.filter(
    (tableName) => !existing.has(tableName),
  );

  if (missing.length > 0) {
    throw new Error(
      `Faltan tablas del esquema Prisma (${missing.join(', ')}). Ejecuta primero las migraciones de Prisma y vuelve a correr el seed.`,
    );
  }
}

async function deleteTables() {
  await prisma.usuarioPerfil.deleteMany();
  await prisma.permisoPerfil.deleteMany();

  await prisma.usuario.deleteMany();
  await prisma.perfil.deleteMany();

  await prisma.permiso.updateMany({
    data: {
      permisoPadreId: null,
    },
  });
  await prisma.permiso.deleteMany();
}

async function syncSequences() {
  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"usuario"', 'usuario_id'), COALESCE(MAX(usuario_id), 1), true) FROM "usuario"`,
  );

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"perfil"', 'perfil_id'), COALESCE(MAX(perfil_id), 1), true) FROM "perfil"`,
  );

  await prisma.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"permiso"', 'permiso_id'), COALESCE(MAX(permiso_id), 1), true) FROM "permiso"`,
  );
}

async function insertUsuarios() {
  for (const usuario of initialData.usuarios) {
    const hashedPassword = await bcrypt.hash(usuario.clave, 10);

    await prisma.usuario.create({
      data: {
        usuarioId: usuario.usuarioId,
        nombre: usuario.nombres,
        apellido: [usuario.apellidoPaterno, usuario.apellidoMaterno]
          .filter((value): value is string => Boolean(value))
          .join(' ')
          .trim(),
        email: usuario.correoElectronico,
        password: hashedPassword,
      },
    });
  }
}

async function insertPerfiles() {
  await prisma.perfil.createMany({
    data: initialData.perfiles.map((perfil) => ({
      perfilId: perfil.perfilId,
      nombre: perfil.nombre,
      descripcion: perfil.descripcion,
    })),
  });
}

async function insertPermisos() {
  await prisma.permiso.createMany({
    data: initialData.permisos.map((permiso) => ({
      permisoId: permiso.permisoId,
      nombre: permiso.nombre,
      keyPermiso: permiso.keyPermiso,
      tipo: permiso.tipoPermiso,
      ruta: permiso.urlMenu,
      descripcion: permiso.descripcion,
      permisoPadreId: permiso.permisoPadreId,
    })),
  });
}

async function assignPermisosToPerfiles() {
  await prisma.permisoPerfil.createMany({
    data: initialData.permisosPerfiles.map((permisoPerfil) => ({
      permisoId: permisoPerfil.permisoId,
      perfilId: permisoPerfil.perfilId,
      orden: permisoPerfil.orden,
    })),
  });
}

async function assignPerfilesToUsuarios() {
  await prisma.usuarioPerfil.createMany({
    data: initialData.usuariosPerfiles.map((usuarioPerfil) => ({
      usuarioId: usuarioPerfil.usuarioId,
      perfilId: usuarioPerfil.perfilId,
    })),
  });
}

async function main() {
  console.log('Iniciando seed con Prisma...');

  await ensureRequiredTables();
  await deleteTables();
  await insertUsuarios();
  await insertPerfiles();
  await insertPermisos();
  await assignPermisosToPerfiles();
  await assignPerfilesToUsuarios();
  await syncSequences();

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
