interface SeedUsuario {
  id: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  dni: string;
  celular?: string;
  correoElectronico: string;
  clave: string;
}

interface SeedPerfil {
  id: string;
  nombre: string;
  descripcion?: string;
}

interface SeedOpcionMenu {
  id: string;
  nombre: string;
  urlMenu: string;
  descripcion?: string;
  idPadre?: string;
}

interface SeedOpcionMenuPerfil {
  idOpcionMenu: string;
  idPerfil: string;
  orden: number;
}

interface SeedUsuarioPerfil {
  idUsuario: string;
  idPerfil: string;
}

interface SeedData {
  usuarios: SeedUsuario[];
  perfiles: SeedPerfil[];
  opcionesMenu: SeedOpcionMenu[];
  opcionesMenuPerfiles: SeedOpcionMenuPerfil[];
  usuariosPerfiles: SeedUsuarioPerfil[];
}

// --- Mapeo de IDs de Excel a UUIDs generados ---
// Usuarios
const user1Id = 'd21eb72f-6e46-4213-9701-9bb153a5f0e5'; // Carlos Rodriguez
const user2Id = 'fff08557-7ded-4da4-b176-6020edbe6c07'; // Jose Rios
const user3Id = '4b8c0180-197f-47ee-b811-e6a6c37bcf3d'; // Roberto Diaz

// Perfiles
const perfilAdminId = 'cf09d342-aed7-4618-a5f2-b1f461d82b70'; // Administrador
export const perfilTecnicoId = 'adc5f58c-33f2-4ab7-a742-5961f9544a40'; // Tecnico

// Opciones de Menu
const menuMantenimientoId = 'c63c4227-290d-46de-8da8-eca58ca06874';
const menuTipoServicioId = '9648cad5-c42e-482b-8b52-fa08072a0c87';
const menuFallasId = '96046421-6f01-4525-9d8a-c744630ebe63';
const menuTipoAsistenciaId = 'f893261a-c55f-45eb-9955-b9b1d8786362';
const menuDetalleTrabajoId = 'e7b1bee5-609b-4a09-8d8f-b6ed26c66a5c';
const menuTrabajosId = 'feb29846-92df-40d7-863c-ba586c2514f0';
const menuOrdenesTrabajoId = '8712cbeb-8cf7-4184-bdbb-7611e5444a4b';
const menuRegistrarTrabajoId = '1de3811f-35fe-4bc5-bf55-74ada2f1cd2a';
const menuUsuariosId = '19556152-df64-43b3-89aa-e9594bf312e7';
const menuLugaresAtencionId = 'dff9cb6e-32c2-4f58-b4f2-3b4536b19a99';

export const initialData: SeedData = {
  usuarios: [
    {
      id: user1Id,
      nombres: 'Carlos',
      apellidoPaterno: 'Rodriguez',
      dni: '99999999',
      correoElectronico: 'crodriguez@gmail.com',
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
      clave: '112233',
    },
    {
      id: user3Id,
      nombres: 'Roberto',
      apellidoPaterno: 'Diaz',
      apellidoMaterno: 'Guerrero',
      dni: '90157845',
      celular: '987456100',
      correoElectronico: 'rdiaz@gmail.com',
      clave: '998811',
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
