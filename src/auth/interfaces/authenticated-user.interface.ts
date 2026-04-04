import { PermisoModulo } from 'generated/prisma/client';

export interface AuthenticatedUser {
  usuarioId: number;
  nombres: string;
  apellido: string;
  correoElectronico: string;
  estadoRegistro: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date | null;
  rol: string;
  permisos: PermisoModulo[];
}
