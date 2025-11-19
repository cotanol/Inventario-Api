import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { DetalleCompra } from './detalle-compra.entity';

export enum EstadoCompra {
  BORRADOR = 'BORRADOR',
  ORDENADO = 'ORDENADO',
  EN_TRANSITO = 'EN_TRANSITO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn({ name: 'compra_id' })
  compraId: number;

  // --- Relación con Proveedor ---
  @Column('int', { name: 'proveedor_id' })
  proveedorId: number;

  @ManyToOne(() => Proveedor, { eager: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  // --- Fechas Operativas ---
  @Column('timestamptz', { name: 'fecha_orden' })
  fechaOrden: Date;

  @Column('timestamptz', { name: 'fecha_llegada_estimada', nullable: true })
  fechaLlegadaEstimada: Date | null;

  // --- Estado ---
  @Column({
    type: 'enum',
    name: 'estado_compra',
    enum: EstadoCompra,
    default: EstadoCompra.BORRADOR,
  })
  estadoCompra: EstadoCompra;

  // --- Dinero ---
  @Column('decimal', {
    name: 'total_compra',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  totalCompra: number;

  // --- Archivo ---
  @Column('varchar', { name: 'url_pdf', length: 255, nullable: true })
  urlPdf: string | null;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Auditoría ---
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;

  // --- Relaciones ---
  @OneToMany(() => DetalleCompra, (detalle) => detalle.compra, {
    cascade: true,
  })
  detalles: DetalleCompra[];
}
