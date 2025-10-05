import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  IsArray,
  IsInt,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'admin@example.com',
  })
  @IsString()
  @IsEmail()
  correoElectronico: string;

  @ApiProperty({
    description:
      'Contraseña del usuario. Debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número o caracter especial.',
    example: 'Password123!',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  clave: string;

  @ApiProperty({
    description: 'Nombres completos del usuario',
    example: 'Juan Alberto',
  })
  @IsString()
  @MinLength(1)
  nombres: string;

  @ApiProperty({
    description: 'Apellido paterno del usuario',
    example: 'Pérez',
  })
  @IsString()
  @MinLength(1)
  apellidoPaterno: string;

  @ApiProperty({
    description: 'Documento Nacional de Identidad del usuario',
    example: '71234567',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  dni: string;

  @ApiProperty({
    description: 'Apellido materno del usuario (opcional)',
    example: 'Gómez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  apellidoMaterno?: string;

  @ApiProperty({
    description: 'Número de celular del usuario (opcional)',
    example: '987654321',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  celular?: string;

  @ApiProperty({
    description:
      'Array de IDs de los perfiles a asignar al usuario. Se requiere al menos uno.',
    example: [1, 2],
  })
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  @ArrayMinSize(1)
  perfilesIds: number[];
}
