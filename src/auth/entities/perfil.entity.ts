import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UsuarioPerfil } from './usuario-perfil.entity';
import { OpcionMenuPerfil } from './opcion-menu-perfil.entity';

@Entity('perfiles')
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'descripcion', length: 500, nullable: true })
  descripcion: string;

  @Column('boolean', { name: 'estado_registro', default: true })
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
