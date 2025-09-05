import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OpcionMenuPerfil } from './opcion-menu-perfil.entity';

@Entity('OpcionesMenu')
export class OpcionMenu {
  @PrimaryGeneratedColumn('uuid', { name: 'IdOpcionMenu' })
  id: string;

  @Column('varchar', { name: 'Nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'UrlMenu', length: 50 })
  urlMenu: string;

  @Column('varchar', { name: 'Descripcion', length: 100, nullable: true })
  descripcion: string;

  @Column('boolean', { name: 'EstadoRegistro', default: true })
  estadoRegistro: boolean;

  // --- Relación Padre-Hijo (jerarquía) ---
  @Column('uuid', { name: 'IdPadre', nullable: true })
  idPadre: string;

  @ManyToOne(() => OpcionMenu, (opcion) => opcion.hijos)
  @JoinColumn({ name: 'IdPadre' })
  padre: OpcionMenu;

  @OneToMany(() => OpcionMenu, (opcion) => opcion.padre)
  hijos: OpcionMenu[];

  // --- Relación con Perfiles ---
  @OneToMany(
    () => OpcionMenuPerfil,
    (opcionMenuPerfil) => opcionMenuPerfil.opcionMenu,
  )
  perfilesLink: OpcionMenuPerfil[];
}
