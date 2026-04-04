import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class CreateProveedorDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreEmpresa!: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  contactoNombre?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  telefono?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numeroIdentificacionFiscal!: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  pais!: string;
}
