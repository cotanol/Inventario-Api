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

// Clase interna para validar cada objeto en el array de opciones de menú
class OpcionMenuEnPerfilDto {
  @IsInt({ message: 'El ID de la opción de menú debe ser un número entero.' })
  opcionMenuId: number;

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
  @Type(() => OpcionMenuEnPerfilDto) // Necesario para que la validación anidada funcione
  opcionesMenu: OpcionMenuEnPerfilDto[];
}
