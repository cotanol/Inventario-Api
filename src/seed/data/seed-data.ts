interface SeedUsuario {
  id: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  dni: string;
  celular?: string;
  correoElectronico: string;
  clave: string;
}

interface SeedPerfil {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface SeedOpcionMenu {
  id: number;
  nombre: string;
  urlMenu: string;
  descripcion?: string;
  idPadre?: number;
}

interface SeedOpcionMenuPerfil {
  idOpcionMenu: number;
  idPerfil: number;
  orden: number;
}

interface SeedUsuarioPerfil {
  idUsuario: number;
  idPerfil: number;
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
      id: user1Id,
      nombres: 'Carlos',
      apellidoPaterno: 'Rodriguez',
      dni: '99999999',
      correoElectronico: 'admin@gmail.com',
      clave: 'admin@123A',
    },
    {
      id: user2Id,
      nombres: 'Jose',
      apellidoPaterno: 'Rios',
      apellidoMaterno: 'Martinez',
      dni: '56879828',
      celular: '923876122',
      correoElectronico: 'jrios@gmail.com',
      clave: 'tecnico@123A',
    },
    {
      id: user3Id,
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
      id: perfilAdminId,
      nombre: 'administrador',
    },
    {
      id: perfilTecnicoId,
      nombre: 'tecnico',
    },
  ],
  opcionesMenu: [
    {
      id: menuMantenimientoId,
      nombre: 'Mantenimiento',
      urlMenu: '/',
    },
    {
      id: menuTipoServicioId,
      nombre: 'Tipo Servicio',
      urlMenu: 'home/TipoServicio',
      idPadre: menuMantenimientoId,
    },
    {
      id: menuFallasId,
      nombre: 'Fallas',
      urlMenu: 'home/Fallas',
      idPadre: menuMantenimientoId,
    },
    {
      id: menuTipoAsistenciaId,
      nombre: 'Tipo Asistencia',
      urlMenu: 'home/TipoAsistencia',
      idPadre: menuMantenimientoId,
    },
    {
      id: menuDetalleTrabajoId,
      nombre: 'Detalle Trabajo',
      urlMenu: 'home/DetalleTrabajo',
      idPadre: menuMantenimientoId,
    },
    {
      id: menuTrabajosId,
      nombre: 'Trabajos',
      urlMenu: '/',
    },
    {
      id: menuOrdenesTrabajoId,
      nombre: 'Ordenes de Trabajo',
      urlMenu: 'home/OrdenesTrabajo',
      idPadre: menuTrabajosId,
    },
    {
      id: menuRegistrarTrabajoId,
      nombre: 'Registrar Trabajo',
      urlMenu: 'home/RegistrarTrabajo',
    },
    {
      id: menuUsuariosId,
      nombre: 'Usuarios',
      urlMenu: 'home/Usuarios',
      idPadre: menuMantenimientoId,
    },
    {
      id: menuLugaresAtencionId,
      nombre: 'Lugares de atencion',
      urlMenu: 'home/LugaresAtencion',
      idPadre: menuMantenimientoId,
    },
  ],
  usuariosPerfiles: [
    { idUsuario: user1Id, idPerfil: perfilAdminId },
    { idUsuario: user2Id, idPerfil: perfilTecnicoId },
    { idUsuario: user3Id, idPerfil: perfilTecnicoId },
  ],
  opcionesMenuPerfiles: [
    { idOpcionMenu: menuMantenimientoId, idPerfil: perfilAdminId, orden: 1 },
    { idOpcionMenu: menuTipoServicioId, idPerfil: perfilAdminId, orden: 2 },
    { idOpcionMenu: menuFallasId, idPerfil: perfilAdminId, orden: 3 },
    { idOpcionMenu: menuTipoAsistenciaId, idPerfil: perfilAdminId, orden: 4 },
    { idOpcionMenu: menuDetalleTrabajoId, idPerfil: perfilAdminId, orden: 5 },
    { idOpcionMenu: menuTrabajosId, idPerfil: perfilAdminId, orden: 1 },
    { idOpcionMenu: menuOrdenesTrabajoId, idPerfil: perfilAdminId, orden: 2 },
    {
      idOpcionMenu: menuRegistrarTrabajoId,
      idPerfil: perfilTecnicoId,
      orden: 1,
    },
    { idOpcionMenu: menuUsuariosId, idPerfil: perfilAdminId, orden: 6 },
    { idOpcionMenu: menuLugaresAtencionId, idPerfil: perfilAdminId, orden: 7 },
  ],
};
