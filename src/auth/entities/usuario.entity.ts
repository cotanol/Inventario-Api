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

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'dni', length: 15 })
  dni: string;

  @Column('varchar', { name: 'nombres', length: 40 })
  nombres: string;

  @Column('varchar', { name: 'apellido_paterno', length: 40 })
  apellidoPaterno: string;

  @Column('varchar', { name: 'apellido_materno', length: 40, nullable: true })
  apellidoMaterno: string;

  @Column('varchar', { name: 'celular', length: 15, nullable: true })
  celular: string;

  @Column('varchar', { name: 'correo_electronico', length: 40, unique: true })
  correoElectronico: string;

  @Column('varchar', { name: 'clave', length: 255, select: false })
  clave: string;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    nullable: true,
  })
  fechaModificacion: Date;

  // --- Relaciones ---
  @OneToMany(() => UsuarioPerfil, (usuarioPerfil) => usuarioPerfil.usuario)
  perfilesLink: UsuarioPerfil[];

  // --- Auditoría ---
  // @ManyToOne(() => Usuario, { nullable: true })
  // @JoinColumn({ name: 'UsuarioCreacion' })
  // usuarioCreacion: Usuario;

  // @CreateDateColumn({ name: 'FechaCreacion', type: 'timestamp' })
  // fechaCreacion: Date;

  // @ManyToOne(() => Usuario, { nullable: true })
  // @JoinColumn({ name: 'UsuarioModificacion' })
  // usuarioModificacion: Usuario;

  // @UpdateDateColumn({
  //   name: 'FechaModificacion',
  //   type: 'timestamp',
  //   nullable: true,
  // })
  // fechaModificacion: Date;
}
