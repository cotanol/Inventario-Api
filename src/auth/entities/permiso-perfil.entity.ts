import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Permiso } from './permiso.entity';
import { Perfil } from './perfil.entity';

@Entity('permisos_perfiles')
export class PermisoPerfil {
  @PrimaryColumn('int', { name: 'permiso_id' })
  permisoId: number;

  @PrimaryColumn('int', { name: 'perfil_id' })
  perfilId: number;

  @Column('smallint', { name: 'orden' })
  orden: number;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @ManyToOne(() => Permiso, (permiso) => permiso.perfilesLink)
  @JoinColumn({ name: 'permiso_id' })
  permiso: Permiso;

  @ManyToOne(() => Perfil, (perfil) => perfil.permisosLink)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;
}
