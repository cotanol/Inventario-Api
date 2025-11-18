import { IsEnum, IsInt, IsNumber, IsPositive, Min } from 'class-validator';
import {
  TipoMovimientoInventario,
  OrigenMovimiento,
} from '../entities/movimiento-inventario.entity';

export class CreateMovimientoInventarioDto {
  @IsInt()
  @IsPositive()
  productoId: number;

  @IsEnum(TipoMovimientoInventario)
  tipoMovimiento: TipoMovimientoInventario;

  @IsInt()
  @Min(1)
  cantidad: number;

  @IsEnum(OrigenMovimiento)
  origenMovimiento: OrigenMovimiento;

  @IsInt()
  @IsPositive()
  documentoReferenciaId: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  costoUnitario: number;
}
