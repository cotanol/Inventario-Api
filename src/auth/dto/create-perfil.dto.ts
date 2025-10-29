import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

// Clase interna para validar cada objeto en el array de permisos
class PermisoEnPerfilDto {
  @IsInt({ message: 'El ID del permiso debe ser un número entero.' })
  permisoId: number;

  @IsInt({ message: 'El orden debe ser un número entero.' })
  @Min(0, { message: 'El orden no puede ser negativo.' })
  orden: number;
}

export class CreatePerfilDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del perfil es requerido.' })
  @MaxLength(50)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto del array
  @Type(() => PermisoEnPerfilDto) // Necesario para que la validación anidada funcione
  permisos: PermisoEnPerfilDto[];
}
