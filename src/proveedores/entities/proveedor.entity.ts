import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Compra } from 'src/compras/entities/compra.entity';

@Entity('proveedores')
export class Proveedor {
  @PrimaryGeneratedColumn({ name: 'proveedor_id' })
  proveedorId: number;

  @Column('varchar', { name: 'nombre_empresa', length: 100 })
  nombreEmpresa: string;

  @Column('varchar', { name: 'contacto_nombre', length: 100, nullable: true })
  contactoNombre: string | null;

  @Column('varchar', { name: 'telefono', length: 20, nullable: true })
  telefono: string | null;

  @Column('varchar', { name: 'email', length: 100, nullable: true })
  email: string | null;

  @Column('varchar', {
    name: 'numero_identificacion_fiscal',
    length: 20,
    unique: true,
  })
  numeroIdentificacionFiscal: string;

  @Column('text', { name: 'direccion', nullable: true })
  direccion: string | null;

  @Column('varchar', { name: 'pais', length: 50 })
  pais: string;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Auditoría ---
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fechaCreacion: Date;

  @UpdateDateColumn({
    name: 'fecha_modificacion',
    type: 'timestamptz',
    nullable: true,
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  fechaModificacion: Date;

  // --- Relaciones ---
  @OneToMany(() => Compra, (compra) => compra.proveedor)
  compras: Compra[];
}
