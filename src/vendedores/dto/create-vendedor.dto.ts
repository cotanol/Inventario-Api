import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateVendedorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombres!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  apellidoPaterno!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  apellidoMaterno?: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  dni!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  correo!: string;
}
