import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PermisoModulo } from 'generated/prisma/client';
import { UserPermissionGuard } from '../guards/user-permission.guard';
import { PermissionProtected } from './permission-protected.decorator';

/**
 * Decorador para proteger rutas con permisos específicos
 * Si no se pasan permisos, solo requiere autenticación
 * Si se pasan permisos, el usuario debe tener al menos uno de ellos
 *
 * @example
 * // Solo autenticación
 * @RequirePermissions()
 *
 * // Requiere el permiso del módulo USUARIOS
 * @RequirePermissions(PermisoModulo.USUARIOS)
 *
 * // Requiere al menos uno de estos permisos
 * @RequirePermissions(PermisoModulo.USUARIOS, PermisoModulo.ROLES)
 */
export function RequirePermissions(...permissions: PermisoModulo[]) {
  return applyDecorators(
    PermissionProtected(...permissions),
    UseGuards(AuthGuard(), UserPermissionGuard),
    ApiBearerAuth(),
  );
}
