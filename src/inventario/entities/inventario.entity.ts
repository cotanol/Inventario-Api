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
  OneToOne,
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
  @OneToOne(() => Producto, (producto) => producto.inventario)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  // --- Validaciones antes de insertar ---
  private validateQuantities() {
    if (this.cantidadActual < 0) {
      throw new Error('La cantidad actual no puede ser un número negativo.');
    }

    if (this.cantidadMinima < 0) {
      throw new Error('La cantidad mínima no puede ser un número negativo.');
    }
  }

  @BeforeInsert()
  runValidationBeforeInsert() {
    this.validateQuantities();
  }

  @BeforeUpdate()
  runValidationBeforeUpdate() {
    this.validateQuantities();
  }
}
