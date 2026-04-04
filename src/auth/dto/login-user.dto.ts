import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class LoginUserDto {
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
}
