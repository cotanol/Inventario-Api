import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Producto } from 'src/catalogo/entities/producto.entity';

export enum TipoMovimientoInventario {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
}

export enum OrigenMovimiento {
  PEDIDO = 'PEDIDO',
  COMPRA = 'COMPRA',
  AJUSTE = 'AJUSTE',
}

@Entity('movimientos_inventario')
@Index(['documentoReferenciaId', 'origenMovimiento'])
export class MovimientoInventario {
  @PrimaryGeneratedColumn({ name: 'movimiento_inventario_id' })
  movimientoInventarioId: number;

  // --- Relación con Producto ---
  @Column('int', { name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // --- Tipo de Movimiento (Dirección) ---
  @Column({
    type: 'enum',
    enum: TipoMovimientoInventario,
    name: 'tipo_movimiento',
  })
  tipoMovimiento: TipoMovimientoInventario; // 'ENTRADA' o 'SALIDA'

  // --- Cantidad ---
  @Column('int', { name: 'cantidad' })
  cantidad: number;

  // --- Referencia Polimórfica (Flexible: Pedido, Compra, Ajuste) ---
  @Column('int', { name: 'documento_referencia_id' })
  @Index()
  documentoReferenciaId: number;

  @Column({
    type: 'enum',
    enum: OrigenMovimiento,
    name: 'origen_movimiento',
  })
  origenMovimiento: OrigenMovimiento; // 'PEDIDO', 'COMPRA', 'AJUSTE'

  // --- Costo Unitario (Kardex - Snapshot Histórico) ---
  @Column('decimal', {
    name: 'costo_unitario',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  costoUnitario: number;

  // --- Timestamp ---
  @CreateDateColumn({
    name: 'fecha_movimiento',
    type: 'timestamptz',
  })
  fechaMovimiento: Date;
}
