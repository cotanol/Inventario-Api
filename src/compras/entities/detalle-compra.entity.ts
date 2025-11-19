import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Compra } from './compra.entity';
import { Producto } from 'src/catalogo/entities/producto.entity';

@Entity('detalles_compra')
export class DetalleCompra {
  @PrimaryGeneratedColumn({ name: 'detalle_compra_id' })
  detalleCompraId: number;

  // --- Relación con Compra ---
  @Column('int', { name: 'compra_id' })
  compraId: number;

  @ManyToOne(() => Compra, (compra) => compra.detalles)
  @JoinColumn({ name: 'compra_id' })
  compra: Compra;

  // --- Relación con Producto ---
  @Column('int', { name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // --- Datos Operativos ---
  @Column('int', { name: 'cantidad_solicitada' })
  cantidadSolicitada: number;

  @Column('int', { name: 'cantidad_recibida', default: 0 })
  cantidadRecibida: number;

  // --- Datos Financieros ---
  @Column('decimal', {
    name: 'costo_unitario',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  costoUnitario: number;

  @Column('decimal', {
    name: 'subtotal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  subtotal: number;
}
