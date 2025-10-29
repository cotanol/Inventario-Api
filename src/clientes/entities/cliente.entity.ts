import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Vendedor } from 'src/vendedores/entities/vendedor.entity';
import { Pedido } from 'src/pedidos/entities/pedido.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({ name: 'cliente_id' })
  clienteId: number;

  // --- Campos Propios del Cliente ---
  @Column('varchar', { name: 'nombre', length: 50 })
  nombre: string;

  @Column('varchar', { name: 'ruc', length: 11, unique: true })
  ruc: string;

  @Column('varchar', { name: 'direccion', length: 50 })
  direccion: string;

  @Column('varchar', { name: 'telefono', length: 50, nullable: true })
  telefono: string;

  @Column('varchar', { name: 'email', length: 100, unique: true })
  email: string;

  @Column('varchar', { name: 'clasificacion', length: 50 })
  clasificacion: string;

  @Column('varchar', { name: 'departamento', length: 50 })
  departamento: string;

  @Column('varchar', { name: 'provincia', length: 50 })
  provincia: string;

  @Column('varchar', { name: 'distrito', length: 50 })
  distrito: string;

  @Column('boolean', { name: 'estado_registro', default: true })
  estadoRegistro: boolean;

  // --- Relación con Vendedor ---
  @Column('int', { name: 'vendedor_id' })
  vendedorId: number;

  @ManyToOne(() => Vendedor, (vendedor) => vendedor.clientes)
  @JoinColumn({ name: 'vendedor_id' })
  vendedor: Vendedor;

  // --- Relación con Pedidos ---
  @OneToMany(() => Pedido, (pedido) => pedido.cliente)
  pedidos: Pedido[];

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
}
