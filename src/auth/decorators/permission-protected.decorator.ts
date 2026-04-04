import { SetMetadata } from '@nestjs/common';
import { PermisoModulo } from 'generated/prisma/client';

export const META_PERMISSIONS = 'permissions';

export const PermissionProtected = (...args: PermisoModulo[]) =>
  SetMetadata(META_PERMISSIONS, args);
