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
import { Linea } from './linea.entity';
import { Producto } from './producto.entity';

@Entity('grupos')
export class Grupo {
  @PrimaryGeneratedColumn({ name: 'grupo_id' })
  grupoId: number;

  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

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
  @ManyToOne(() => Linea, (linea) => linea.grupos)
  @JoinColumn({ name: 'linea_id' })
  linea: Linea;

  @OneToMany(() => Producto, (producto) => producto.grupo)
  productos: Producto[];
}
