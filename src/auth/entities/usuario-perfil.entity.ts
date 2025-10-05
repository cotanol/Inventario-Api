import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Perfil } from './perfil.entity';
import { Usuario } from './usuario.entity';

@Entity('usuarios_perfiles')
export class UsuarioPerfil {
  @PrimaryColumn('int', { name: 'id_usuario' })
  idUsuario: number;

  @PrimaryColumn('int', { name: 'id_perfil' })
  idPerfil: number;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @ManyToOne(() => Usuario, (usuario) => usuario.perfilesLink)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Perfil, (perfil) => perfil.usuariosLink)
  @JoinColumn({ name: 'id_perfil' })
  perfil: Perfil;
}
