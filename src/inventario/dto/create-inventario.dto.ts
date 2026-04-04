import {
  IsNumber,
  IsPositive,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateInventarioDto {
  @IsNumber()
  @IsPositive()
  productoId!: number;

  @IsNumber()
  @Min(1)
  cantidadActual!: number;

  @IsNumber()
  @Min(1)
  cantidadMinima!: number;

  @IsBoolean()
  @IsOptional()
  estadoRegistro?: boolean;
}
