import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import { UpdateCompraDto } from './dto/update-compra.dto';
import { Compra, EstadoCompra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Producto } from 'src/catalogo/entities/producto.entity';

@Injectable()
export class ComprasService {
  constructor(
    @InjectRepository(Compra)
    private readonly compraRepository: Repository<Compra>,
    @InjectRepository(DetalleCompra)
    private readonly detalleCompraRepository: Repository<DetalleCompra>,
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createCompraDto: CreateCompraDto): Promise<Compra> {
    // Validar proveedor
    const proveedor = await this.proveedorRepository.findOne({
      where: { proveedorId: createCompraDto.proveedorId },
    });

    if (!proveedor) {
      throw new NotFoundException(
        `Proveedor con ID ${createCompraDto.proveedorId} no encontrado`,
      );
    }

    // Crear la compra
    const compra = this.compraRepository.create({
      proveedorId: createCompraDto.proveedorId,
      fechaOrden: new Date(createCompraDto.fechaOrden),
      fechaLlegadaEstimada: createCompraDto.fechaLlegadaEstimada
        ? new Date(createCompraDto.fechaLlegadaEstimada)
        : null,
      estadoCompra: createCompraDto.estadoCompra || EstadoCompra.BORRADOR,
      totalCompra: 0,
    });

    const compraSaved = await this.compraRepository.save(compra);

    // Crear los detalles
    let totalCompra = 0;
    const detalles: DetalleCompra[] = [];

    for (const detalleDto of createCompraDto.detalles) {
      const producto = await this.productoRepository.findOne({
        where: { productoId: detalleDto.productoId },
      });

      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${detalleDto.productoId} no encontrado`,
        );
      }

      const subtotal = detalleDto.cantidadSolicitada * detalleDto.costoUnitario;
      totalCompra += subtotal;

      const detalle = this.detalleCompraRepository.create({
        compraId: compraSaved.compraId,
        productoId: detalleDto.productoId,
        cantidadSolicitada: detalleDto.cantidadSolicitada,
        cantidadRecibida: 0,
        costoUnitario: detalleDto.costoUnitario,
        subtotal,
      });

      detalles.push(detalle);
    }

    await this.detalleCompraRepository.save(detalles);

    // Actualizar total
    compraSaved.totalCompra = totalCompra;
    return await this.compraRepository.save(compraSaved);
  }

  async findAll(): Promise<Compra[]> {
    return await this.compraRepository.find({
      relations: ['proveedor', 'detalles', 'detalles.producto'],
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Compra> {
    const compra = await this.compraRepository.findOne({
      where: { compraId: id },
      relations: ['proveedor', 'detalles', 'detalles.producto'],
    });

    if (!compra) {
      throw new NotFoundException(`Compra con ID ${id} no encontrada`);
    }

    return compra;
  }

  async update(id: number, updateCompraDto: UpdateCompraDto): Promise<Compra> {
    const compra = await this.findOne(id);

    if (compra.estadoCompra === EstadoCompra.COMPLETADO) {
      throw new BadRequestException(
        'No se puede modificar una compra completada',
      );
    }

    Object.assign(compra, updateCompraDto);
    return await this.compraRepository.save(compra);
  }

  async remove(id: number): Promise<void> {
    const compra = await this.findOne(id);

    if (compra.estadoCompra === EstadoCompra.COMPLETADO) {
      throw new BadRequestException(
        'No se puede eliminar una compra completada',
      );
    }

    await this.compraRepository.remove(compra);
  }
}
