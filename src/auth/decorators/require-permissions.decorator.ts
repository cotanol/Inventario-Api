import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserPermissionGuard } from '../guards/user-permission.guard';
import { PermissionProtected } from './permission-protected.decorator';
import { ValidPermissions } from '../interfaces/valid-permissions.interface';

/**
 * Decorador para proteger rutas con permisos específicos
 * Si no se pasan permisos, solo requiere autenticación
 * Si se pasan permisos, el usuario debe tener al menos uno de ellos
 *
 * @example
 * // Solo autenticación
 * @RequirePermissions()
 *
 * // Requiere el permiso CREAR_USUARIO
 * @RequirePermissions(ValidPermissions.CREAR_USUARIO)
 *
 * // Requiere al menos uno de estos permisos
 * @RequirePermissions(ValidPermissions.CREAR_USUARIO, ValidPermissions.EDITAR_USUARIO)
 */
export function RequirePermissions(...permissions: ValidPermissions[]) {
  return applyDecorators(
    PermissionProtected(...permissions),
    UseGuards(AuthGuard(), UserPermissionGuard),
  );
}
