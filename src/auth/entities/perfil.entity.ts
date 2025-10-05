import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsuarioPerfil } from './usuario-perfil.entity';
import { OpcionMenuPerfil } from './opcion-menu-perfil.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryGeneratedColumn({ name: 'perfil_id' })
  perfilId: number;

  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'descripcion', length: 500, nullable: true })
  descripcion: string;

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
  @OneToMany(() => UsuarioPerfil, (usuarioPerfil) => usuarioPerfil.perfil)
  usuariosLink: UsuarioPerfil[];

  @OneToMany(
    () => OpcionMenuPerfil,
    (opcionMenuPerfil) => opcionMenuPerfil.perfil,
  )
  opcionesMenuLink: OpcionMenuPerfil[];
}
