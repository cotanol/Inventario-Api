import { PartialType } from '@nestjs/swagger';
import { CreateCompraDto } from './create-compra.dto';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { EstadoCompra } from '../entities/compra.entity';

export class UpdateCompraDto extends PartialType(CreateCompraDto) {}

// DTO específico para cambiar el estado de la compra (completar recepción)
export class ChangeEstadoCompraDto {
  @IsEnum(EstadoCompra, {
    message:
      'El estado debe ser BORRADOR, ORDENADO, EN_TRANSITO, COMPLETADO o CANCELADO',
  })
  estadoCompra: EstadoCompra;
}

// DTO para actualizar cantidades recibidas al completar la compra
export class UpdateCantidadRecibidaDto {
  @IsInt()
  @IsPositive()
  detalleCompraId: number;

  @IsInt()
  @IsPositive()
  cantidadRecibida: number;
}
