import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Vendedor } from 'src/vendedores/entities/vendedor.entity';
import { DetallePedido } from './detalle-pedido.entity';
import { MovimientoInventario } from 'src/inventario/entities/movimiento-inventario.entity';

export enum estadoPedido {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

@Entity('pedidos')
export class Pedido {
  @PrimaryGeneratedColumn({ name: 'pedido_id' })
  pedidoId: number;

  // --- Relación con Cliente ---
  @Column('int', { name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  // --- Relación con Vendedor ---
  @Column('int', { name: 'vendedor_id' })
  vendedorId: number;

  @ManyToOne(() => Vendedor, { eager: true })
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Vendedor;

  // --- Campos Propios del Pedido ---
  @Column('varchar', { name: 'tipo_pago', length: 20 })
  tipoPago: string; // 'CONTADO' o 'CREDITO'

  @Column('decimal', {
    name: 'total_neto',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalNeto: number;

  @Column('decimal', {
    name: 'total_final',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalFinal: number;

  @Column('varchar', { name: 'url_pdf', length: 255, nullable: true })
  urlPdf: string;

  @Column({
    type: 'enum',
    name: 'estado_pedido',
    enum: estadoPedido,
    default: estadoPedido.PENDIENTE,
  })
  estadoPedido: estadoPedido; // 'PENDIENTE', 'COMPLETADO', 'CANCELADO'

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relación con Detalles del Pedido ---
  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
  detalles: DetallePedido[];

  // --- Relación con Movimientos de Inventario ---
  @OneToMany(() => MovimientoInventario, (movimiento) => movimiento.pedido)
  movimientos: MovimientoInventario[];

  // --- Timestamps ---
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;
}
