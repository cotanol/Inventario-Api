import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'cliente_id' })
  clienteId: number;

  // --- Campos Propios del Cliente ---
  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'ruc', length: 11, unique: true })
  ruc: string;

  @Column('varchar', { name: 'direccion', length: 50 })
  direccion: string;

  @Column('varchar', { name: 'telefono', length: 50 })
  telefono: string;

  @Column('varchar', { name: 'email', length: 100, unique: true })
  email: string;

  @Column('varchar', { name: 'clasificacion', length: 50 })
  clasificacion: string;

  @Column('varchar', { name: 'departamento', length: 30 })
  departamento: string;

  @Column('varchar', { name: 'distrito', length: 30 })
  distrito: string;

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
}
