import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsPositive,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

// DTO para cada detalle del pedido
export class CreateDetallePedidoDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}

// DTO principal para crear un pedido
export class CreatePedidoDto {
  @IsInt()
  @IsNotEmpty()
  clienteId: number;

  @IsInt()
  @IsNotEmpty()
  vendedorId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn(['CONTADO', 'CREDITO'], {
    message: 'El tipo de pago debe ser CONTADO o CREDITO',
  })
  tipoPago: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreateDetallePedidoDto)
  detalles: CreateDetallePedidoDto[];
}
