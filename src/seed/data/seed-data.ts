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

interface SeedOpcionMenu {
  opcionMenuId: number;
  nombre: string;
  urlMenu: string;
  descripcion?: string;
  opcionMenuPadreId?: number;
}

interface SeedOpcionMenuPerfil {
  opcionMenuId: number;
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
  opcionesMenu: SeedOpcionMenu[];
  opcionesMenuPerfiles: SeedOpcionMenuPerfil[];
  usuariosPerfiles: SeedUsuarioPerfil[];
}

// IDs numéricos incrementales
const user1Id = 1; // Carlos Rodriguez
const user2Id = 2; // Jose Rios
const user3Id = 3; // Roberto Diaz

const perfilAdminId = 1; // Administrador
export const perfilTecnicoId = 2; // Tecnico

const menuMantenimientoId = 1;
const menuTipoServicioId = 2;
const menuFallasId = 3;
const menuTipoAsistenciaId = 4;
const menuDetalleTrabajoId = 5;
const menuTrabajosId = 6;
const menuOrdenesTrabajoId = 7;
const menuRegistrarTrabajoId = 8;
const menuUsuariosId = 9;
const menuLugaresAtencionId = 10;

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
  opcionesMenu: [
    {
      opcionMenuId: menuMantenimientoId,
      nombre: 'Mantenimiento',
      urlMenu: '/',
    },
    {
      opcionMenuId: menuTipoServicioId,
      nombre: 'Tipo Servicio',
      urlMenu: 'home/TipoServicio',
      opcionMenuPadreId: menuMantenimientoId,
    },
    {
      opcionMenuId: menuFallasId,
      nombre: 'Fallas',
      urlMenu: 'home/Fallas',
      opcionMenuPadreId: menuMantenimientoId,
    },
    {
      opcionMenuId: menuTipoAsistenciaId,
      nombre: 'Tipo Asistencia',
      urlMenu: 'home/TipoAsistencia',
      opcionMenuPadreId: menuMantenimientoId,
    },
    {
      opcionMenuId: menuDetalleTrabajoId,
      nombre: 'Detalle Trabajo',
      urlMenu: 'home/DetalleTrabajo',
      opcionMenuPadreId: menuMantenimientoId,
    },
    {
      opcionMenuId: menuTrabajosId,
      nombre: 'Trabajos',
      urlMenu: '/',
    },
    {
      opcionMenuId: menuOrdenesTrabajoId,
      nombre: 'Ordenes de Trabajo',
      urlMenu: 'home/OrdenesTrabajo',
      opcionMenuPadreId: menuTrabajosId,
    },
    {
      opcionMenuId: menuRegistrarTrabajoId,
      nombre: 'Registrar Trabajo',
      urlMenu: 'home/RegistrarTrabajo',
    },
    {
      opcionMenuId: menuUsuariosId,
      nombre: 'Usuarios',
      urlMenu: 'home/Usuarios',
      opcionMenuPadreId: menuMantenimientoId,
    },
    {
      opcionMenuId: menuLugaresAtencionId,
      nombre: 'Lugares de atencion',
      urlMenu: 'home/LugaresAtencion',
      opcionMenuPadreId: menuMantenimientoId,
    },
  ],
  usuariosPerfiles: [
    { usuarioId: user1Id, perfilId: perfilAdminId },
    { usuarioId: user2Id, perfilId: perfilTecnicoId },
    { usuarioId: user3Id, perfilId: perfilTecnicoId },
  ],
  opcionesMenuPerfiles: [
    { opcionMenuId: menuMantenimientoId, perfilId: perfilAdminId, orden: 1 },
    { opcionMenuId: menuTipoServicioId, perfilId: perfilAdminId, orden: 2 },
    { opcionMenuId: menuFallasId, perfilId: perfilAdminId, orden: 3 },
    { opcionMenuId: menuTipoAsistenciaId, perfilId: perfilAdminId, orden: 4 },
    { opcionMenuId: menuDetalleTrabajoId, perfilId: perfilAdminId, orden: 5 },
    { opcionMenuId: menuTrabajosId, perfilId: perfilAdminId, orden: 1 },
    { opcionMenuId: menuOrdenesTrabajoId, perfilId: perfilAdminId, orden: 2 },
    {
      opcionMenuId: menuRegistrarTrabajoId,
      perfilId: perfilTecnicoId,
      orden: 1,
    },
    { opcionMenuId: menuUsuariosId, perfilId: perfilAdminId, orden: 6 },
    { opcionMenuId: menuLugaresAtencionId, perfilId: perfilAdminId, orden: 7 },
  ],
};
