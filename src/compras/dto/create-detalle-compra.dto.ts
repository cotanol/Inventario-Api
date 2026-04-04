import { IsInt, IsPositive } from 'class-validator';

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
