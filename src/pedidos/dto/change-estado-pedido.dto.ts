import { IsEnum } from 'class-validator';
import { EstadoPedido } from '../entities/pedido.entity';

export class ChangeEstadoPedidoDto {
  @IsEnum(EstadoPedido, {
    message: 'El estado del pedido debe ser PENDIENTE, COMPLETADO o CANCELADO',
  })
  estadoPedido: EstadoPedido;
}
