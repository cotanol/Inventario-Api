import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pedido } from './pedido.entity';
import { Producto } from 'src/catalogo/entities/producto.entity';

@Entity('detalles_pedido')
export class DetallePedido {
  @PrimaryGeneratedColumn({ name: 'detalle_id' })
  detalleId: number;

  // --- Relación con Pedido ---
  @Column('int', { name: 'pedido_id' })
  pedidoId: number;

  @ManyToOne(() => Pedido, (pedido) => pedido.detalles)
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  // --- Relación con Producto ---
  @Column('int', { name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // --- Campos Propios del Detalle ---
  @Column('int', { name: 'cantidad' })
  cantidad: number;

  @Column('decimal', {
    name: 'precio_unitario',
    precision: 10,
    scale: 2,
  })
  precioUnitario: number;

  @Column('decimal', {
    name: 'subtotal_linea',
    precision: 10,
    scale: 2,
  })
  subtotalLinea: number;
}
