import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateGrupoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @IsNumber()
  @IsPositive()
  lineaId: number;

  @IsBoolean()
  @IsOptional()
  estadoRegistro?: boolean;
}
