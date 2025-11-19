import { PartialType } from '@nestjs/swagger';
import { CreateCompraDto } from './create-compra.dto';
import {
  IsEnum,
  IsInt,
  IsPositive,
  IsArray,
  ValidateNested,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoCompra } from '../entities/compra.entity';

export class UpdateCompraDto extends PartialType(CreateCompraDto) {}

// DTO específico para cambiar el estado de la compra
export class ChangeEstadoCompraDto {
  @IsEnum(EstadoCompra, {
    message:
      'El estado debe ser BORRADOR, ORDENADO, EN_TRANSITO, COMPLETADO o CANCELADO',
  })
  estadoCompra: EstadoCompra;

  @IsDateString()
  @IsOptional()
  fechaLlegadaEstimada?: string;
}

// DTO para recibir mercadería (cantidades reales recibidas)
export class CantidadRecibidaDto {
  @IsInt()
  @IsPositive()
  detalleCompraId: number;

  @IsInt()
  @IsPositive()
  cantidadRecibida: number;
}

export class RecibirMercaderiaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CantidadRecibidaDto)
  detalles: CantidadRecibidaDto[];
}

// DTO para confirmar orden (pasar de BORRADOR a ORDENADO)
export class ConfirmarOrdenDto {
  @IsDateString()
  @IsOptional()
  fechaLlegadaEstimada?: string;
}
