import { PermisoModulo } from '../generated/prisma/client';

interface SeedRole {
  nombre: string;
  descripcion: string;
  permisos: PermisoModulo[];
}

interface SeedUser {
  nombre: string;
  apellido: string;
  correoElectronico: string;
  clave: string;
  rol: string;
}

interface SeedData {
  roles: SeedRole[];
  usuarios: SeedUser[];
}

export const initialData: SeedData = {
  roles: [
    {
      nombre: 'admin',
      descripcion: 'Acceso total al sistema',
      permisos: [
        PermisoModulo.USUARIOS,
        PermisoModulo.PRODUCTOS,
        PermisoModulo.CLIENTES,
        PermisoModulo.MARCAS,
        PermisoModulo.LINEAS,
        PermisoModulo.GRUPOS,
        PermisoModulo.ROLES,
        PermisoModulo.VENDEDORES,
        PermisoModulo.PROVEEDORES,
        PermisoModulo.COMPRAS,
        PermisoModulo.PEDIDOS,
      ],
    },
    {
      nombre: 'vendedor',
      descripcion: 'Gestion comercial basica',
      permisos: [PermisoModulo.CLIENTES, PermisoModulo.PEDIDOS],
    },
  ],
  usuarios: [
    {
      nombre: 'Carlos',
      apellido: 'Rodriguez',
      correoElectronico: 'admin@dym.com',
      clave: 'admin@123A',
      rol: 'admin',
    },
    {
      nombre: 'Maria',
      apellido: 'Gonzalez Lopez',
      correoElectronico: 'vendedor@dym.com',
      clave: 'vendedor@123A',
      rol: 'vendedor',
    },
  ],
};
