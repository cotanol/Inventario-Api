import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsInt,
  IsPositive,
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
  correoElectronico!: string;

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
  clave!: string;

  @ApiProperty({
    description: 'Nombres completos del usuario',
    example: 'Juan Alberto',
  })
  @IsString()
  @MinLength(1)
  nombres!: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Perez Gomez',
  })
  @IsString()
  @MinLength(1)
  apellido!: string;

  @ApiProperty({
    description: 'ID del rol a asignar al usuario.',
    example: 1,
  })
  @IsInt()
  @Type(() => Number)
  @IsPositive()
  rolId!: number;
}
