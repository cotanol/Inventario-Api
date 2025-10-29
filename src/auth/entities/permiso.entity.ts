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
import { PermisoPerfil } from './permiso-perfil.entity';

enum TipoPermiso {
  MENU = 'MENU',
  ACCION = 'ACCION',
}

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn({ name: 'permiso_id' })
  permisoId: number;

  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'url_menu', length: 50, nullable: true })
  urlMenu: string;

  @Column('enum', {
    name: 'tipo_permiso',
    enum: TipoPermiso,
    default: TipoPermiso.MENU,
  })
  tipoPermiso: TipoPermiso;

  @Column('varchar', { name: 'key_permiso', length: 50 })
  keyPermiso: string;

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
  @Column('int', { name: 'permiso_padre_id', nullable: true })
  permisoPadreId: number;

  @ManyToOne(() => Permiso, (permiso) => permiso.permisosHijos)
  @JoinColumn({ name: 'permiso_padre_id' })
  permisoPadre: Permiso;

  @OneToMany(() => Permiso, (permiso) => permiso.permisoPadre)
  permisosHijos: Permiso[];

  // --- Relación con Perfiles ---
  @OneToMany(() => PermisoPerfil, (permisoPerfil) => permisoPerfil.permiso)
  perfilesLink: PermisoPerfil[];
}
