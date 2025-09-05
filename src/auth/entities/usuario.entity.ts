import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UsuarioPerfil } from './usuario-perfil.entity';

@Entity('Usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid', { name: 'IdUsuario' })
  id: string;

  @Column('varchar', { name: 'DNI', length: 15 })
  dni: string;

  @Column('varchar', { name: 'Nombres', length: 40 })
  nombres: string;

  @Column('varchar', { name: 'ApellidoPaterno', length: 40 })
  apellidoPaterno: string;

  @Column('varchar', { name: 'ApellidoMaterno', length: 40, nullable: true })
  apellidoMaterno: string;

  @Column('varchar', { name: 'Celular', length: 15, nullable: true })
  celular: string;

  @Column('varchar', { name: 'CorreoElectronico', length: 40, unique: true })
  correoElectronico: string;

  @Column('varchar', { name: 'Clave', length: 255, select: false })
  clave: string;

  @Column('boolean', { name: 'EstadoRegistro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @OneToMany(() => UsuarioPerfil, (usuarioPerfil) => usuarioPerfil.usuario)
  perfilesLink: UsuarioPerfil[];

  // --- Auditoría ---
  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'UsuarioCreacion' })
  usuarioCreacion: Usuario;

  @CreateDateColumn({ name: 'FechaCreacion', type: 'timestamp' })
  fechaCreacion: Date;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'UsuarioModificacion' })
  usuarioModificacion: Usuario;

  @UpdateDateColumn({
    name: 'FechaModificacion',
    type: 'timestamp',
    nullable: true,
  })
  fechaModificacion: Date;
}
