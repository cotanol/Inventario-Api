import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { OpcionMenu } from './opcion-menu.entity';
import { Perfil } from './perfil.entity';

@Entity('opciones_menu_perfiles')
export class OpcionMenuPerfil {
  @PrimaryColumn('int', { name: 'id_opcion_menu' })
  idOpcionMenu: number;

  @PrimaryColumn('int', { name: 'id_perfil' })
  idPerfil: number;

  @Column('smallint', { name: 'orden' })
  orden: number;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @ManyToOne(() => OpcionMenu, (opcionMenu) => opcionMenu.perfilesLink)
  @JoinColumn({ name: 'id_opcion_menu' })
  opcionMenu: OpcionMenu;

  @ManyToOne(() => Perfil, (perfil) => perfil.opcionesMenuLink)
  @JoinColumn({ name: 'id_perfil' })
  perfil: Perfil;
}
