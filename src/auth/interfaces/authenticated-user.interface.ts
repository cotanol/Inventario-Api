export interface AuthenticatedPermiso {
  permisoId: number;
  nombre: string;
  descripcion: string | null;
  tipoPermiso: 'MENU' | 'ACCION';
  urlMenu: string | null;
  icono: string | null;
  idPadre: number | null;
  estadoRegistro: boolean;
  orden: number;
}

export interface AuthenticatedPerfil {
  perfilId: number;
  nombre: string;
  descripcion: string | null;
  estadoRegistro: boolean;
  permisosLink: AuthenticatedPermiso[];
}

export interface AuthenticatedUser {
  usuarioId: number;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  celular: string | null;
  correoElectronico: string;
  estadoRegistro: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date | null;
  perfilesLink: AuthenticatedPerfil[];
}
