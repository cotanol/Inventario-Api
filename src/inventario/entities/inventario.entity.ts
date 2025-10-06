import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Producto } from '../../catalogo/entities/producto.entity';

@Entity('inventarios')
export class Inventario {
  @PrimaryGeneratedColumn({ name: 'inventario_id' })
  inventarioId: number;

  @Column('int', { name: 'cantidad_actual' })
  cantidadActual: number;

  @Column('int', { name: 'cantidad_minima' })
  cantidadMinima: number;

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
  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // --- Validaciones antes de insertar ---
  @BeforeInsert()
  validateBeforeInsert() {
    if (this.cantidadActual < 1) {
      throw new Error('La cantidad actual debe ser mayor a 0');
    }
    if (this.cantidadMinima < 1) {
      throw new Error('La cantidad mínima debe ser mayor a 0');
    }
  }

  // --- Validaciones antes de actualizar ---
  @BeforeUpdate()
  validateBeforeUpdate() {
    if (this.cantidadActual < 1) {
      throw new Error('La cantidad actual debe ser mayor a 0');
    }
    if (this.cantidadMinima < 1) {
      throw new Error('La cantidad mínima debe ser mayor a 0');
    }
  }
}
