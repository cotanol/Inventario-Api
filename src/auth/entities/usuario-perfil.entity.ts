import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Perfil } from './perfil.entity';
import { Usuario } from './usuario.entity';

@Entity('Usuario_Perfiles')
export class UsuarioPerfil {
  @PrimaryColumn('uuid', { name: 'IdUsuario' })
  idUsuario: string;

  @PrimaryColumn('uuid', { name: 'IdPerfil' })
  idPerfil: string;

  @Column('boolean', { name: 'EstadoRegistro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @ManyToOne(() => Usuario, (usuario) => usuario.perfilesLink)
  @JoinColumn({ name: 'IdUsuario' })
  usuario: Usuario;

  @ManyToOne(() => Perfil, (perfil) => perfil.usuariosLink)
  @JoinColumn({ name: 'IdPerfil' })
  perfil: Perfil;
}
