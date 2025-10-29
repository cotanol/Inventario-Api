import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class ChangeEstadoPedidoDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(['PENDIENTE', 'COMPLETADO', 'CANCELADO'], {
    message: 'El estado del pedido debe ser PENDIENTE, COMPLETADO o CANCELADO',
  })
  estadoPedido: string;
}
