import {
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsPositive,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCompra } from 'generated/prisma/client';

// DTO para cada detalle de la compra
export class CreateDetalleCompraDto {
  @IsInt()
  @IsPositive()
  productoId!: number;

  @IsInt()
  @IsPositive()
  cantidadSolicitada!: number;

  @IsPositive()
  costoUnitario!: number;
}

// DTO principal para crear una compra
export class CreateCompraDto {
  @IsInt()
  @IsNotEmpty()
  proveedorId!: number;

  @IsDateString()
  @IsNotEmpty()
  fechaOrden!: string;

  @IsDateString()
  @IsOptional()
  fechaLlegadaEstimada?: string;

  @IsEnum(EstadoCompra, {
    message:
      'El estado debe ser BORRADOR, ORDENADO, EN_TRANSITO, COMPLETADO o CANCELADO',
  })
  @IsOptional()
  estadoCompra?: EstadoCompra;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCompraDto)
  detalles!: CreateDetalleCompraDto[];
}
