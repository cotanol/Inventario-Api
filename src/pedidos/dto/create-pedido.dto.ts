import {
  IsInt,
  IsNotEmpty,
  IsEnum,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPago } from 'generated/prisma/client';

// DTO para cada detalle del pedido
export class CreateDetallePedidoDto {
  @IsInt()
  @IsPositive()
  productoId!: number;

  @IsInt()
  @IsPositive()
  cantidad!: number;
}

// DTO principal para crear un pedido
export class CreatePedidoDto {
  @IsInt()
  @IsNotEmpty()
  clienteId!: number;

  @IsInt()
  @IsNotEmpty()
  vendedorId!: number;

  @IsEnum(TipoPago, {
    message: 'El tipo de pago debe ser CONTADO o CREDITO',
  })
  tipoPago!: TipoPago;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetallePedidoDto)
  detalles!: CreateDetallePedidoDto[];
}
