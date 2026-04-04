import { PermisoModulo } from 'generated/prisma/client';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es requerido.' })
  @MaxLength(50)
  nombre!: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  descripcion?: string;

  @IsArray()
  @IsEnum(PermisoModulo, { each: true })
  permisos!: PermisoModulo[];
}
