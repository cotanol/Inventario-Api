import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioPerfil } from './usuario-perfil.entity';
import { OpcionMenuPerfil } from './opcion-menu-perfil.entity';

@Entity('Perfiles')
export class Perfil {
  @PrimaryGeneratedColumn('uuid', { name: 'IdPerfil' })
  id: string;

  @Column('varchar', { name: 'Nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'Descripcion', length: 500, nullable: true })
  descripcion: string;

  @Column('boolean', { name: 'EstadoRegistro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @OneToMany(() => UsuarioPerfil, (usuarioPerfil) => usuarioPerfil.perfil)
  usuariosLink: UsuarioPerfil[];

  @OneToMany(
    () => OpcionMenuPerfil,
    (opcionMenuPerfil) => opcionMenuPerfil.perfil,
  )
  opcionesMenuLink: OpcionMenuPerfil[];
}
