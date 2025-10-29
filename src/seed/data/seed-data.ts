interface SeedUsuario {
  usuarioId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  dni: string;
  celular?: string;
  correoElectronico: string;
  clave: string;
}

interface SeedPerfil {
  perfilId: number;
  nombre: string;
  descripcion?: string;
}

interface SeedPermiso {
  permisoId: number;
  nombre: string;
  keyPermiso: string;
  urlMenu: string;
  descripcion?: string;
  permisoPadreId?: number;
}

interface SeedPermisoPerfil {
  permisoId: number;
  perfilId: number;
  orden: number;
}

interface SeedUsuarioPerfil {
  usuarioId: number;
  perfilId: number;
}

interface SeedData {
  usuarios: SeedUsuario[];
  perfiles: SeedPerfil[];
  permisos: SeedPermiso[];
  permisosPerfiles: SeedPermisoPerfil[];
  usuariosPerfiles: SeedUsuarioPerfil[];
}

// IDs numéricos incrementales
const user1Id = 1; // Carlos Rodriguez
const user2Id = 2; // Jose Rios
const user3Id = 3; // Roberto Diaz

const perfilAdminId = 1; // Administrador
export const perfilTecnicoId = 2; // Tecnico

const permisoMantenimientoId = 1;
const permisoTipoServicioId = 2;
const permisoFallasId = 3;
const permisoTipoAsistenciaId = 4;
const permisoDetalleTrabajoId = 5;
const permisoTrabajosId = 6;
const permisoOrdenesTrabajoId = 7;
const permisoRegistrarTrabajoId = 8;
const permisoUsuariosId = 9;
const permisoLugaresAtencionId = 10;

export const initialData: SeedData = {
  usuarios: [
    {
      usuarioId: user1Id,
      nombres: 'Carlos',
      apellidoPaterno: 'Rodriguez',
      dni: '99999999',
      correoElectronico: 'admin@gmail.com',
      clave: 'admin@123A',
    },
    {
      usuarioId: user2Id,
      nombres: 'Jose',
      apellidoPaterno: 'Rios',
      apellidoMaterno: 'Martinez',
      dni: '56879828',
      celular: '923876122',
      correoElectronico: 'jrios@gmail.com',
      clave: 'tecnico@123A',
    },
    {
      usuarioId: user3Id,
      nombres: 'Roberto',
      apellidoPaterno: 'Diaz',
      apellidoMaterno: 'Guerrero',
      dni: '90157845',
      celular: '987456100',
      correoElectronico: 'rdiaz@gmail.com',
      clave: 'tecnico@123B',
    },
  ],
  perfiles: [
    {
      perfilId: perfilAdminId,
      nombre: 'administrador',
    },
    {
      perfilId: perfilTecnicoId,
      nombre: 'tecnico',
    },
  ],
  permisos: [
    {
      permisoId: permisoMantenimientoId,
      keyPermiso: 'CREAR_USUARIO',
      nombre: 'Crear Usuario',
      urlMenu: '/',
    },
    {
      permisoId: permisoTipoServicioId,
      keyPermiso: 'EDITAR_USUARIO',
      nombre: 'Editar Usuario',
      urlMenu: 'home/TipoServicio',
      permisoPadreId: permisoMantenimientoId,
    },
    {
      permisoId: permisoFallasId,
      keyPermiso: 'ELIMINAR_USUARIO',
      nombre: 'Eliminar Usuario',
      urlMenu: 'home/Fallas',
      permisoPadreId: permisoMantenimientoId,
    },
    {
      permisoId: permisoTipoAsistenciaId,
      keyPermiso: 'CREAR_PRODUCTO',
      nombre: 'Crear Producto',
      urlMenu: 'home/TipoAsistencia',
      permisoPadreId: permisoMantenimientoId,
    },
    {
      permisoId: permisoDetalleTrabajoId,
      keyPermiso: 'EDITAR_PRODUCTO',
      nombre: 'Editar Producto',
      urlMenu: 'home/DetalleTrabajo',
      permisoPadreId: permisoMantenimientoId,
    },
    {
      permisoId: permisoTrabajosId,
      keyPermiso: 'ELIMINAR_PRODUCTO',
      nombre: 'Eliminar Producto',
      urlMenu: '/',
    },
    {
      permisoId: permisoOrdenesTrabajoId,
      keyPermiso: 'CREAR_CLIENTE',
      nombre: 'Crear Cliente',
      urlMenu: 'home/OrdenesTrabajo',
      permisoPadreId: permisoTrabajosId,
    },
    {
      permisoId: permisoRegistrarTrabajoId,
      keyPermiso: 'EDITAR_CLIENTE',
      nombre: 'Editar Cliente',
      urlMenu: 'home/RegistrarTrabajo',
    },
    {
      permisoId: permisoUsuariosId,
      keyPermiso: 'USUARIOS',
      nombre: 'Usuarios',
      urlMenu: 'home/Usuarios',
      permisoPadreId: permisoMantenimientoId,
    },
    {
      permisoId: permisoLugaresAtencionId,
      keyPermiso: 'ELIMINAR_CLIENTE',
      nombre: 'Eliminar Cliente',
      urlMenu: 'home/LugaresAtencion',
      permisoPadreId: permisoMantenimientoId,
    },
  ],
  usuariosPerfiles: [
    { usuarioId: user1Id, perfilId: perfilAdminId },
    { usuarioId: user2Id, perfilId: perfilTecnicoId },
    { usuarioId: user3Id, perfilId: perfilTecnicoId },
  ],
  permisosPerfiles: [
    { permisoId: permisoMantenimientoId, perfilId: perfilAdminId, orden: 1 },
    { permisoId: permisoTipoServicioId, perfilId: perfilAdminId, orden: 2 },
    { permisoId: permisoFallasId, perfilId: perfilAdminId, orden: 3 },
    { permisoId: permisoTipoAsistenciaId, perfilId: perfilAdminId, orden: 4 },
    { permisoId: permisoDetalleTrabajoId, perfilId: perfilAdminId, orden: 5 },
    { permisoId: permisoTrabajosId, perfilId: perfilAdminId, orden: 1 },
    { permisoId: permisoOrdenesTrabajoId, perfilId: perfilAdminId, orden: 2 },
    {
      permisoId: permisoRegistrarTrabajoId,
      perfilId: perfilTecnicoId,
      orden: 1,
    },
    { permisoId: permisoUsuariosId, perfilId: perfilAdminId, orden: 6 },
    { permisoId: permisoLugaresAtencionId, perfilId: perfilAdminId, orden: 7 },
  ],
};
