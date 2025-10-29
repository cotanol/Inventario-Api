import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from 'src/catalogo/entities/producto.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

export enum TipoMovimientoInventario {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn({ name: 'movimiento_inventario_id' })
  movimientoInventarioId: number;

  // --- Relación con Producto ---
  @Column('int', { name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // --- Tipo de Movimiento ---
  @Column({
    type: 'varchar',
    name: 'tipo_movimiento',
    length: 10,
  })
  tipoMovimiento: TipoMovimientoInventario; // 'ENTRADA' o 'SALIDA'

  // --- Cantidad ---
  @Column('int', { name: 'cantidad' })
  cantidad: number;

  // --- Relación con Pedido (solo para SALIDA) ---
  @Column('int', { name: 'pedido_id', nullable: true })
  pedidoId: number;

  @ManyToOne(() => Pedido, { nullable: true })
  @JoinColumn({ name: 'pedido_id' })
  pedido: Pedido;

  // --- Relación con Compra (solo para ENTRADA) ---
  // TODO: Agregar cuando se implemente el módulo de compras
  // @Column('int', { name: 'compra_id', nullable: true })
  // compraId: number;

  // @ManyToOne(() => Compra, { nullable: true })
  // @JoinColumn({ name: 'compra_id' })
  // compra: Compra;

  // --- Timestamp ---
  @CreateDateColumn({
    name: 'fecha_movimiento',
    type: 'timestamptz',
  })
  fechaMovimiento: Date;
}
