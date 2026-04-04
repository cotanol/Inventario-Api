import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  Length,
  IsInt,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  @Length(11, 11, { message: 'El RUC debe tener exactamente 11 dígitos' })
  ruc!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  direccion!: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  telefono?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  clasificacion!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  departamento!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  provincia!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  distrito!: string;

  @IsInt()
  @IsNotEmpty()
  vendedorId!: number;
}
