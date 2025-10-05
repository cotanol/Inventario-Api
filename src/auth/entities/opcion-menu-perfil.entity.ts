import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { OpcionMenu } from './opcion-menu.entity';
import { Perfil } from './perfil.entity';

@Entity('opciones_menu_perfiles')
export class OpcionMenuPerfil {
  @PrimaryColumn('int', { name: 'opcion_menu_id' })
  opcionMenuId: number;

  @PrimaryColumn('int', { name: 'perfil_id' })
  perfilId: number;

  @Column('smallint', { name: 'orden' })
  orden: number;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @ManyToOne(() => OpcionMenu, (opcionMenu) => opcionMenu.perfilesLink)
  @JoinColumn({ name: 'opcion_menu_id' })
  opcionMenu: OpcionMenu;

  @ManyToOne(() => Perfil, (perfil) => perfil.opcionesMenuLink)
  @JoinColumn({ name: 'perfil_id' })
  perfil: Perfil;
}
