import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Grupo } from './grupo.entity';
import { Marca } from './marca.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn({ name: 'producto_id' })
  productoId: number;

  @Column('varchar', { name: 'codigo', length: 20, unique: true })
  codigo: string;

  @Column('varchar', { name: 'nombre', length: 100 })
  nombre: string;

  @Column('text', { name: 'descripcion', nullable: true })
  descripcion: string;

  @Column('decimal', {
    name: 'precio',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  precio: number;

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

  @ManyToOne(() => Grupo, (grupo) => grupo.productos)
  @JoinColumn({ name: 'grupo_id' })
  grupo: Grupo;

  @ManyToOne(() => Marca, (marca) => marca.productos)
  @JoinColumn({ name: 'marca_id' })
  marca: Marca;

  @OneToOne(() => Inventario, (inventario) => inventario.producto, {
    cascade: true, // Permite crear/actualizar el inventario junto con el producto
  })
  inventario: Inventario;
}
