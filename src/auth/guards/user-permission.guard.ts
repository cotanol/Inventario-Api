import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
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

    // Extraer todos los permisos únicos del usuario desde sus perfiles
    const userPermissions = new Set<string>();
    user.perfilesLink?.forEach((userProfile) => {
      userProfile.permisosLink?.forEach((permisoLink) => {
        if (permisoLink.estadoRegistro && permisoLink.keyPermiso) {
          userPermissions.add(permisoLink.keyPermiso);
        }
      });
    });

    // Verificar si el usuario tiene al menos uno de los permisos requeridos
    for (const permission of validPermissions) {
      if (userPermissions.has(permission)) return true;
    }

    throw new ForbiddenException(
      `User ${user.nombres + ' ' + user.apellidoPaterno} needs one of these permissions: [${validPermissions.join(', ')}]`,
    );
  }
}
