import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

import { Perfil } from './perfil.entity';
import { Usuario } from './usuario.entity';

@Entity('usuarios_perfiles')
export class UsuarioPerfil {
  @PrimaryColumn('int', { name: 'usuario_id' })
  usuarioId: number;

  @PrimaryColumn('int', { name: 'perfil_id' })
  perfilId: number;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @ManyToOne(() => Usuario, (usuario) => usuario.perfilesLink)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Perfil, (perfil) => perfil.usuariosLink)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;
}
