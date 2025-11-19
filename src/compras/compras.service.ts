import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateCompraDto } from './dto/create-compra.dto';
import {
  UpdateCompraDto,
  ConfirmarOrdenDto,
  RecibirMercaderiaDto,
} from './dto/update-compra.dto';
import { Compra, EstadoCompra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Proveedor } from 'src/proveedores/entities/proveedor.entity';
import { Producto } from 'src/catalogo/entities/producto.entity';
import { Inventario } from 'src/inventario/entities/inventario.entity';
import {
  MovimientoInventario,
  TipoMovimientoInventario,
  OrigenMovimiento,
} from 'src/inventario/entities/movimiento-inventario.entity';
import { ReportsService } from 'src/reports/reports.service';

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
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(MovimientoInventario)
    private readonly movimientoInventarioRepository: Repository<MovimientoInventario>,
    private readonly dataSource: DataSource,
    private readonly reportsService: ReportsService,
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

    // Validaciones según el estado
    if (compra.estadoCompra === EstadoCompra.COMPLETADO) {
      throw new BadRequestException(
        'No se puede modificar una compra completada',
      );
    }

    if (compra.estadoCompra === EstadoCompra.CANCELADO) {
      throw new BadRequestException(
        'No se puede modificar una compra cancelada',
      );
    }

    if (
      compra.estadoCompra !== EstadoCompra.BORRADOR &&
      compra.estadoCompra !== EstadoCompra.ORDENADO
    ) {
      throw new BadRequestException(
        'Solo se pueden editar compras en estado BORRADOR u ORDENADO',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // En estado ORDENADO solo se puede actualizar fecha estimada
      if (compra.estadoCompra === EstadoCompra.ORDENADO) {
        if (updateCompraDto.fechaLlegadaEstimada !== undefined) {
          const fechaEstimada = updateCompraDto.fechaLlegadaEstimada
            ? new Date(updateCompraDto.fechaLlegadaEstimada)
            : null;

          await queryRunner.manager.update(Compra, id, {
            fechaLlegadaEstimada: fechaEstimada,
          });
        }

        await queryRunner.commitTransaction();
        return await this.findOne(id);
      }

      // Para estado BORRADOR: permitir edición completa
      // Actualizar datos básicos de la compra
      if (updateCompraDto.proveedorId) {
        const proveedor = await this.proveedorRepository.findOne({
          where: { proveedorId: updateCompraDto.proveedorId },
        });

        if (!proveedor) {
          throw new NotFoundException(
            `Proveedor con ID ${updateCompraDto.proveedorId} no encontrado`,
          );
        }

        compra.proveedorId = updateCompraDto.proveedorId;
      }

      if (updateCompraDto.fechaOrden) {
        compra.fechaOrden = new Date(updateCompraDto.fechaOrden);
      }

      if (updateCompraDto.fechaLlegadaEstimada !== undefined) {
        compra.fechaLlegadaEstimada = updateCompraDto.fechaLlegadaEstimada
          ? new Date(updateCompraDto.fechaLlegadaEstimada)
          : null;
      }

      // Si hay detalles en el DTO, actualizar los detalles
      if (updateCompraDto.detalles && updateCompraDto.detalles.length > 0) {
        // Eliminar detalles anteriores
        await queryRunner.manager.delete(DetalleCompra, {
          compraId: id,
        });

        // Crear nuevos detalles con INSERT directo
        let totalCompra = 0;

        for (const detalleDto of updateCompraDto.detalles) {
          const producto = await this.productoRepository.findOne({
            where: { productoId: detalleDto.productoId },
          });

          if (!producto) {
            throw new NotFoundException(
              `Producto con ID ${detalleDto.productoId} no encontrado`,
            );
          }

          const subtotal =
            detalleDto.cantidadSolicitada * detalleDto.costoUnitario;
          totalCompra += subtotal;

          // Insertar directamente con queryRunner
          await queryRunner.manager.insert(DetalleCompra, {
            compraId: id,
            productoId: detalleDto.productoId,
            cantidadSolicitada: detalleDto.cantidadSolicitada,
            cantidadRecibida: 0,
            costoUnitario: detalleDto.costoUnitario,
            subtotal,
          });
        }

        compra.totalCompra = totalCompra;
      }

      // Actualizar la compra usando update() para evitar problemas con las relaciones
      await queryRunner.manager.update(Compra, id, {
        proveedorId: compra.proveedorId,
        fechaOrden: compra.fechaOrden,
        fechaLlegadaEstimada: compra.fechaLlegadaEstimada,
        totalCompra: compra.totalCompra,
      });

      await queryRunner.commitTransaction();
      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const compra = await this.findOne(id);

    // Solo se pueden eliminar compras en BORRADOR
    if (compra.estadoCompra !== EstadoCompra.BORRADOR) {
      throw new BadRequestException(
        'Solo se pueden eliminar compras en estado BORRADOR',
      );
    }

    await this.compraRepository.remove(compra);
  }

  // ============================================================
  // MÉTODOS DE TRANSICIÓN DE ESTADO (Lógica de Negocio)
  // ============================================================

  /**
   * A. BORRADOR -> ORDENADO
   * Confirma la orden y genera el PDF para enviar al proveedor
   */
  async confirmarOrden(
    id: number,
    confirmarOrdenDto: ConfirmarOrdenDto,
  ): Promise<Compra> {
    const compra = await this.findOne(id);

    // Validación de estado
    if (compra.estadoCompra !== EstadoCompra.BORRADOR) {
      throw new BadRequestException(
        'Solo se pueden confirmar compras en estado BORRADOR',
      );
    }

    // Validar que tenga detalles
    if (!compra.detalles || compra.detalles.length === 0) {
      throw new BadRequestException(
        'La compra debe tener al menos un producto',
      );
    }

    // Actualizar estado y fecha estimada si fue provista
    compra.estadoCompra = EstadoCompra.ORDENADO;
    if (confirmarOrdenDto.fechaLlegadaEstimada) {
      compra.fechaLlegadaEstimada = new Date(
        confirmarOrdenDto.fechaLlegadaEstimada,
      );
    }

    // Generar PDF de Orden de Compra
    try {
      const pdfUrl = await this.reportsService.saveOrdenCompraReport(compra);
      compra.urlPdf = pdfUrl;
    } catch (error) {
      console.error('Error al generar PDF de Orden de Compra:', error);
      // No lanzamos error, solo log. La orden se confirma de todas formas
    }

    return await this.compraRepository.save(compra);
  }

  /**
   * B. ORDENADO -> EN_TRANSITO
   * Marca que el proveedor despachó la mercadería
   */
  async marcarEnTransito(
    id: number,
    fechaLlegadaEstimada?: string,
  ): Promise<Compra> {
    const compra = await this.findOne(id);

    // Validación de estado
    if (compra.estadoCompra !== EstadoCompra.ORDENADO) {
      throw new BadRequestException(
        'Solo se pueden marcar en tránsito compras en estado ORDENADO',
      );
    }

    // Actualizar estado
    compra.estadoCompra = EstadoCompra.EN_TRANSITO;

    // Actualizar fecha estimada si fue provista
    if (fechaLlegadaEstimada) {
      compra.fechaLlegadaEstimada = new Date(fechaLlegadaEstimada);
    }

    return await this.compraRepository.save(compra);
  }

  /**
   * C. EN_TRANSITO -> COMPLETADO (CRÍTICO)
   * Recibe la mercadería, actualiza cantidades reales y mueve inventario
   */
  async recibirMercaderia(
    id: number,
    recibirMercaderiaDto: RecibirMercaderiaDto,
  ): Promise<Compra> {
    const compra = await this.findOne(id);

    // Validación de estado
    if (compra.estadoCompra !== EstadoCompra.EN_TRANSITO) {
      throw new BadRequestException(
        'Solo se pueden recibir compras en estado EN_TRANSITO',
      );
    }

    // Usar transacción para garantizar consistencia
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Actualizar cantidades recibidas en los detalles
      for (const detalleRecibido of recibirMercaderiaDto.detalles) {
        const detalle = await queryRunner.manager.findOne(DetalleCompra, {
          where: { detalleCompraId: detalleRecibido.detalleCompraId },
        });

        if (!detalle) {
          throw new NotFoundException(
            `Detalle de compra ${detalleRecibido.detalleCompraId} no encontrado`,
          );
        }

        // Validar que no reciba más de lo solicitado
        if (detalleRecibido.cantidadRecibida > detalle.cantidadSolicitada) {
          throw new BadRequestException(
            `No se puede recibir más de lo solicitado para el producto ${detalle.productoId}`,
          );
        }

        // Actualizar cantidad recibida
        detalle.cantidadRecibida = detalleRecibido.cantidadRecibida;
        await queryRunner.manager.save(detalle);

        // 2. Crear MovimientoInventario (Kardex) - ENTRADA
        const movimiento = queryRunner.manager.create(MovimientoInventario, {
          productoId: detalle.productoId,
          tipoMovimiento: TipoMovimientoInventario.ENTRADA,
          origenMovimiento: OrigenMovimiento.COMPRA,
          documentoReferenciaId: compra.compraId,
          cantidad: detalleRecibido.cantidadRecibida,
          costoUnitario: detalle.costoUnitario,
        });

        await queryRunner.manager.save(movimiento);

        // 3. Actualizar Inventario (Sumar stock)
        const inventario = await queryRunner.manager.findOne(Inventario, {
          where: { producto: { productoId: detalle.productoId } },
        });

        if (inventario) {
          inventario.cantidadActual += detalleRecibido.cantidadRecibida;
          await queryRunner.manager.save(inventario);
        }

        // 4. Actualizar Costo Referencial del Producto
        const producto = await queryRunner.manager.findOne(Producto, {
          where: { productoId: detalle.productoId },
        });

        if (producto) {
          producto.costoReferencial = detalle.costoUnitario;
          await queryRunner.manager.save(producto);
        }
      }

      // 5. Cambiar estado de la compra a COMPLETADO
      compra.estadoCompra = EstadoCompra.COMPLETADO;
      await queryRunner.manager.save(compra);

      // Confirmar transacción
      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      // Revertir transacción en caso de error
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberar recursos
      await queryRunner.release();
    }
  }

  /**
   * D. Cualquier estado -> CANCELADO
   * Cancela la compra (solo si no está COMPLETADO)
   */
  async cancelarCompra(id: number): Promise<Compra> {
    const compra = await this.findOne(id);

    // Validación: No se puede cancelar si ya está completado
    if (compra.estadoCompra === EstadoCompra.COMPLETADO) {
      throw new BadRequestException(
        'No se puede cancelar una compra que ya ha sido completada. Si necesita revertir el inventario, debe hacer un ajuste manual.',
      );
    }

    // Validación: No se puede cancelar si ya está cancelado
    if (compra.estadoCompra === EstadoCompra.CANCELADO) {
      throw new BadRequestException('La compra ya está cancelada');
    }

    // Cambiar estado a CANCELADO
    compra.estadoCompra = EstadoCompra.CANCELADO;
    return await this.compraRepository.save(compra);
  }
}
