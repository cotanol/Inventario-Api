import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { OpcionMenuPerfil } from './opcion-menu-perfil.entity';

@Entity('opciones_menu')
export class OpcionMenu {
  @PrimaryGeneratedColumn({ name: 'opcion_menu_id' })
  opcionMenuId: number;

  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'url_menu', length: 50, nullable: true })
  urlMenu: string;

  @Column('varchar', { name: 'descripcion', length: 100, nullable: true })
  descripcion: string;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // Auditoría
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;

  // --- Relación Padre-Hijo (jerarquía) ---
  @Column('int', { name: 'opcion_menu_padre_id', nullable: true })
  opcionMenuPadreId: number;

  @ManyToOne(() => OpcionMenu, (opcion) => opcion.opcionesMenuHijos)
  @JoinColumn({ name: 'opcion_menu_padre_id' })
  opcionMenuPadre: OpcionMenu;

  @OneToMany(() => OpcionMenu, (opcion) => opcion.opcionMenuPadre)
  opcionesMenuHijos: OpcionMenu[];

  // --- Relación con Perfiles ---
  @OneToMany(
    () => OpcionMenuPerfil,
    (opcionMenuPerfil) => opcionMenuPerfil.opcionMenu,
  )
  perfilesLink: OpcionMenuPerfil[];
}
