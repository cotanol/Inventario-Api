import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OpcionMenuPerfil } from './opcion-menu-perfil.entity';

@Entity('opciones_menu')
export class OpcionMenu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'url_menu', length: 50 })
  urlMenu: string;

  @Column('varchar', { name: 'descripcion', length: 100, nullable: true })
  descripcion: string;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relación Padre-Hijo (jerarquía) ---
  @Column('uuid', { name: 'id_padre', nullable: true })
  idPadre: string;

  @ManyToOne(() => OpcionMenu, (opcion) => opcion.hijos)
  @JoinColumn({ name: 'id_padre' })
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
