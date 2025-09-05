import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  correoElectronico: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  clave: string;

  @IsString()
  @MinLength(1)
  nombres: string;

  @IsString()
  @MinLength(1)
  apellidoPaterno: string;

  @IsString()
  @MinLength(8)
  @MaxLength(15)
  dni: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  apellidoMaterno?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  celular?: string;
}
