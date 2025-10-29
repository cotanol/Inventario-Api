import { SetMetadata } from '@nestjs/common';
import { ValidPermissions } from '../interfaces/valid-permissions.interface';

export const META_PERMISSIONS = 'permissions';

export const PermissionProtected = (...args: ValidPermissions[]) =>
  SetMetadata(META_PERMISSIONS, args);
