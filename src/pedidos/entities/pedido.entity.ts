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

export enum EstadoPedido {
  PENDIENTE = 'PENDIENTE',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

export enum TipoPago {
  CONTADO = 'CONTADO',
  CREDITO = 'CREDITO',
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
  @Column({
    type: 'enum',
    enum: TipoPago,
    name: 'tipo_pago',
  })
  tipoPago: TipoPago; // 'CONTADO' o 'CREDITO'

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
    enum: EstadoPedido,
    default: EstadoPedido.PENDIENTE,
  })
  estadoPedido: EstadoPedido; // 'PENDIENTE', 'COMPLETADO', 'CANCELADO'

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relación con Detalles del Pedido ---
  @OneToMany(() => DetallePedido, (detalle) => detalle.pedido)
  detalles: DetallePedido[];

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
