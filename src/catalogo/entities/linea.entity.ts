import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Grupo } from './grupo.entity';

@Entity('lineas')
export class Linea {
  @PrimaryGeneratedColumn({ name: 'linea_id' })
  lineaId: number;

  @Column('varchar', { name: 'nombre', length: 50, unique: true })
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
  @OneToMany(() => Grupo, (grupo) => grupo.linea)
  grupos: Grupo[];
}
