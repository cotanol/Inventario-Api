import { PermisoModulo } from 'generated/prisma/client';

export interface AuthenticatedUser {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  estadoRegistro: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date | null;
  rol: string;
  permisos: PermisoModulo[];
}
