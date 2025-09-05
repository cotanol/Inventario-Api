import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { OpcionMenu } from './opcion-menu.entity';
import { Perfil } from './perfil.entity';

@Entity('OpcionesMenu_Perfiles')
export class OpcionMenuPerfil {
  @PrimaryColumn('uuid', { name: 'IdOpcionMenu' })
  idOpcionMenu: string;

  @PrimaryColumn('uuid', { name: 'IdPerfil' })
  idPerfil: string;

  @Column('smallint', { name: 'Orden' })
  orden: number;

  @Column('boolean', { name: 'EstadoRegistro', default: true })
  estadoRegistro: boolean;

  // --- Relaciones ---
  @ManyToOne(() => OpcionMenu, (opcionMenu) => opcionMenu.perfilesLink)
  @JoinColumn({ name: 'IdOpcionMenu' })
  opcionMenu: OpcionMenu;

  @ManyToOne(() => Perfil, (perfil) => perfil.opcionesMenuLink)
  @JoinColumn({ name: 'IdPerfil' })
  perfil: Perfil;
}
