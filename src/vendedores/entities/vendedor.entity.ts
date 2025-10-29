import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from 'src/clientes/entities/cliente.entity';

@Entity('vendedores')
export class Vendedor {
  @PrimaryGeneratedColumn({ name: 'vendedor_id' })
  vendedorId: number;

  @Column('varchar', { name: 'nombres', length: 50 })
  nombres: string;

  @Column('varchar', { name: 'apellido_paterno', length: 50 })
  apellidoPaterno: string;

  @Column('varchar', { name: 'apellido_materno', length: 50, nullable: true })
  apellidoMaterno: string;

  @Column('varchar', { name: 'dni', length: 8, unique: true })
  dni: string;

  @Column('varchar', { name: 'correo', length: 100, unique: true })
  correo: string;

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
  @OneToMany(() => Cliente, (cliente) => cliente.vendedor)
  clientes: Cliente[];
}
