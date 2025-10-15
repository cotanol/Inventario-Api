import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsPositive,
  Min,
  IsInt,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @IsNumber()
  @IsPositive()
  grupoId: number;

  @IsNumber()
  @IsPositive()
  marcaId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precio: number;

  @IsInt({ message: 'La cantidad actual debe ser un número entero.' })
  @Min(0, { message: 'La cantidad actual no puede ser negativa.' })
  cantidadActual?: number;

  @IsInt({ message: 'La cantidad mínima debe ser un número entero.' })
  @Min(0, { message: 'La cantidad mínima no puede ser negativa.' })
  cantidadMinima?: number;

  @IsBoolean()
  @IsOptional()
  estadoRegistro?: boolean;
}
