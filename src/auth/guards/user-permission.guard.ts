import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PermisoModulo } from 'generated/prisma/client';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { META_PERMISSIONS } from '../decorators/permission-protected.decorator';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validPermissions: string[] = this.reflector.get(
      META_PERMISSIONS,
      context.getHandler(),
    );

    // Si no hay permisos definidos, permitir acceso (solo autenticación)
    if (!validPermissions) return true;
    if (validPermissions.length === 0) return true;

    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: AuthenticatedUser }>();
    const user = req.user;

    if (!user) throw new BadRequestException('User not found');

    const userPermissions = new Set<PermisoModulo>(user.permisos);

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    for (const permission of validPermissions) {
      if (userPermissions.has(permission as PermisoModulo)) return true;
    }

    throw new ForbiddenException(
      `User ${user.nombre + ' ' + user.apellido} needs one of these permissions: [${validPermissions.join(', ')}]`,
    );
  }
}
